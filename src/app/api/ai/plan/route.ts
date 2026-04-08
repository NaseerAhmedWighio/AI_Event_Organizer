import { NextRequest, NextResponse } from "next/server";
import { createAIPlan, type CreateAIPlanInput } from "@/actions/aiPlanActions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await createAIPlan(body as CreateAIPlanInput);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, plan: result.plan }, { status: 201 });
  } catch (error) {
    console.error("Error in AI plan route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
