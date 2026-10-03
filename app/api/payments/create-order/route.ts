// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Parse Request Body
    const body = await request.json();
    const { amount, currency = "INR", receipt } = body;

    // 2. Basic Validation (Security Check)
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount. Amount must be greater than 0." },
        { status: 400 }
      );
    }

    console.log("🔧 MOCK MODE ACTIVE: Razorpay integration is currently in testing mode.");
    console.log("📦 Order Details Received:", { amount, currency, receipt });

    // 3. Simulate Network Delay (ताकि Frontend पर Loading Spinner असली लगे)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 4. Generate Realistic Mock Data
    const mockOrderId = `order_Mock_${Date.now()}`;
    const amountInPaise = Math.round(amount * 100); // Razorpay always expects Paise

    // 5. Return Response (Exact same shape as real Razorpay API)
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      keyId: "rzp_test_MOCK_KEY_ID_FOR_DEVELOPMENT", // Frontend को यह Mock Key मिलेगी
      receipt: receipt || `receipt_woc_${Date.now()}`,
      message: "Mock order created successfully. Ready for UI testing.",
    });

  } catch (error: unknown) {
    console.error("❌ Mock Order Creation Error:", error);
    
    let errorMessage = "Failed to create mock order";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}