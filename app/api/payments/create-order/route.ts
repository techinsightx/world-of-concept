// app/api/payments/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, receipt } = body;

    // TEMPORARY BYPASS: Razorpay को call नहीं करेंगे, बस mock data return करेंगे
    // जब असली Keys होंगी, तब इसे revert करेंगे
    
    console.log("🔧 MOCK MODE: Razorpay bypassed for testing");
    console.log("Order details:", { amount, currency, receipt });

    // Mock Order ID generate करें
    const mockOrderId = `mock_order_${Date.now()}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amount,
      currency: currency || "INR",
      keyId: "mock_key_id_for_testing",
      message: "This is a mock response. Razorpay is temporarily disabled.",
    });
  } catch (error: unknown) {
    console.error("Mock Order Creation Error:", error);
    
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