/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

// TypeScript को बताएं कि window ऑब्जेक्ट में Razorpay होगा
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: any) => void) => void;
    };
  }
}

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OrderData {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  message?: string;
}

interface PaymentButtonProps {
  courseId: string;
  courseTitle: string;
  amountInRupees: number;
}

export default function PaymentButton({ courseId, courseTitle, amountInRupees }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Ensure Razorpay script is loaded only once if needed globally, 
  // but here we handle it dynamically per click for safety in SSR environments.
  
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (loading || status === "success") return;
    
    setLoading(true);
    setStatus("processing");
    setErrorMsg("");

    try {
      // 1. Backend API से Order ID मांगें
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInRupees * 100, // Convert to paise
          currency: "INR",
          receipt: `receipt_${courseId}_${Date.now()}`,
        }),
      });

      const data: OrderData = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create order.");
      }

      // 🔧 MOCK MODE CHECK: If backend returns mock response, skip Razorpay
      if (data.message && data.message.toLowerCase().includes("mock")) {
        // Simulate delay for realism
        await new Promise(r => setTimeout(r, 1500));
        
        setStatus("success");
        setLoading(false);
        alert(`🔧 MOCK PAYMENT SUCCESSFUL!\n\nOrder ID: ${data.orderId}\nAmount: ₹${amountInRupees}\n\nNote: Razorpay keys not configured yet.`);
        return;
      }

      // 2. Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay object not found on window.");
      }

      // 3. Initialize Razorpay Options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "World of Concept",
        description: courseTitle,
        order_id: data.orderId,
        handler: function (response: PaymentResponse) {
          console.log("✅ Payment Success:", response);
          setStatus("success");
          
          // Optional: Call backend to verify signature and unlock course
          // fetch('/api/payments/verify-signature', ...)
          
          alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nRedirecting...`);
          
          // Redirect to dashboard or course page after short delay
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        },
        prefill: {
          name: "", // Can be fetched from auth context if available
          email: "",
          contact: "",
        },
        notes: {
          address: "Alamnagar, Madhepura, Bihar",
        },
        theme: {
          color: "#ffffff", // Matches the matte white text/buttons
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setStatus("idle");
            console.log("❌ Payment Cancelled by User");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      // Handle Razorpay internal errors
      rzp.on('payment.failed', function (response: any) {
        console.error("❌ Payment Failed:", response.error);
        setLoading(false);
        setStatus("error");
        setErrorMsg(response.error.description || "Payment failed. Please try again.");
        alert(`❌ Payment Failed:\n${response.error.reason}`);
      });

      rzp.open();

    } catch (error: unknown) {
      console.error("Payment Error:", error);
      const msg = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      setStatus("error");
      setLoading(false);
      alert(`⚠️ Error: ${msg}`);
    }
  };

  // Reset status if idle for a while (optional UX improvement)
  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="w-full relative group">
      {/* Main Button */}
      <button
        onClick={handlePayment}
        disabled={loading || status === "success"}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ease-out
          flex items-center justify-center gap-2 shadow-lg
          ${status === 'success' 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default' 
            : 'bg-white text-slate-900 hover:bg-gray-100 hover:shadow-xl active:scale-[0.98]'
          }
          ${loading ? 'opacity-90 cursor-wait' : ''}
          disabled:cursor-not-allowed
        `}
        aria-label={status === 'success' ? "Payment Completed" : "Proceed to Payment"}
      >
        {status === "success" ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span>Enrolled Successfully</span>
          </>
        ) : loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
            <span>Securing Transaction...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 text-slate-900" />
            <span>Pay ₹{amountInRupees} Securely</span>
          </>
        )}
      </button>

      {/* Trust Badge Below Button */}
      <div className="flex items-center justify-center gap-1.5 mt-3 opacity-70 group-hover:opacity-100 transition-opacity">
        <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          256-bit SSL Encrypted • Powered by Razorpay
        </span>
      </div>

      {/* Error Message Display (if any) */}
      {status === "error" && errorMsg && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center animate-fade-in-up">
          <p className="text-xs text-red-300 font-medium flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
}