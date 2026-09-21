// app/test-payment/page.tsx
import PaymentButton from "@/components/PaymentButton";

export default function TestPaymentPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Razorpay Integration</h1>
        <p className="text-gray-600">Click the button below to test the payment flow.</p>
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
      </div>
    </main>
  );
}