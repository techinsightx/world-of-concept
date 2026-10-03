// app/test-payment/page.tsx
import PaymentButton from "@/components/PaymentButton";
import Link from "next/link";

export default function TestPaymentPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 relative">
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 transition"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="text-center mb-8 max-w-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Test Razorpay Integration</h1>
        <p className="text-gray-600">This is a safe test environment. Click the button below to simulate a payment.</p>
      </div>

      <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-100 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Class 10 Math Masterclass</h2>
        <p className="text-gray-500 mb-4">By RK Sir | Complete Guidance</p>
        <p className="text-4xl font-bold text-blue-600 mb-6">₹499</p>
        
        <PaymentButton 
          courseId="math_class_10_001" 
          courseTitle="Class 10 Math: Objective Masterclass" 
          amountInRupees={499} 
        />
        
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 font-semibold mb-1">💡 Test Card Details:</p>
          <p className="text-xs text-blue-700">Card: 4111 1111 1111 1111</p>
          <p className="text-xs text-blue-700">Expiry: Any future date (e.g., 12/25)</p>
          <p className="text-xs text-blue-700">CVV: Any 3 digits (e.g., 123)</p>
        </div>
      </div>
    </main>
  );
}