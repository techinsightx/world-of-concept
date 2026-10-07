// app/api/seed-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, fullName, secretKey } = body;

    // Security Check: Only allow with correct secret key
    if (secretKey !== "WOC_ADMIN_SEED_2025_RK_SIR") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid secret key" },
        { status: 401 }
      );
    }

    if (!uid || !email || !fullName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: uid, email, fullName" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingDoc = await getDoc(doc(db, "students", uid));
    
    if (existingDoc.exists()) {
      // Update existing user to admin
      await setDoc(doc(db, "students", uid), {
        role: "admin",
      }, { merge: true });

      return NextResponse.json({
        success: true,
        message: `User ${fullName} updated to admin role successfully!`,
      });
    }

    // Create new admin document
    await setDoc(doc(db, "students", uid), {
      fullName: fullName,
      email: email,
      role: "admin",
      uid: uid,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Admin account created for ${fullName}!`,
    });

  } catch (error: unknown) {
    console.error("Seed Admin Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to seed admin" },
      { status: 500 }
    );
  }
}