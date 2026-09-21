// components/PaymentButton.tsx
"use client";

import { useState } from "react";

// TypeScript को बताएं कि window ऑब्जेक्ट में Razorpay होगा
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface PaymentButtonProps {
  courseId: string;
  courseTitle: string;
  amountInRupees: number;
}

export default function PaymentButton({ courseId, courseTitle, amountInRupees }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Backend API से Order ID मांगें
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInRupees * 100, // रुपये को पैसे में बदलें (499 * 100 = 49900)
          currency: "INR",
          receipt: `receipt_${courseId}`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Payment start karne mein dikkat aayi: " + data.message);
        setLoading(false);
        return;
      }

      // 2. Razorpay Script को dynamically load करें (ताकि page load पर slow न हो)
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      
      script.onload = () => {
        // 3. Razorpay Options सेट करें
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "World of Concept",
          description: courseTitle,
          order_id: data.orderId,
          handler: function (response: Record<string, string>) {
            alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nOrder ID: ${response.razorpay_order_id}`);
            // यहाँ बाद में हम Firestore में payment save करेंगे
          },
          prefill: {
            name: "Student Name",
            email: "student@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#2563eb", // Tailwind blue-600
          },
        };

        // 4. Razorpay Modal खोलें
        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        alert("Razorpay SDK load hone mein dikkat aayi. Internet check karein.");
      };

      document.body.appendChild(script);

    } catch (error: unknown) {
      console.error("Payment Error:", error);
      alert("Kuch gadbad ho gayi! Console check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        "Enroll Now - Pay Securely"
      )}
    </button>
  );
}