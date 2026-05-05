import connectDb from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json();
    const { ownerId, businessName, supportEmail, knowledge } = body;

    if (!ownerId) {
      return NextResponse.json(
        { message: "ownerId is required" },
        { status: 400 }
      );
    }

    const settings = await Settings.findOneAndUpdate(
      { ownerId },
      {
        ownerId,
        businessName,
        supportEmail,
        knowledge,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return NextResponse.json(settings);

  } catch (error: any) {
    console.error("SETTINGS API ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
        stack: error.stack
      },
      { status: 500 }
    );
  }
}