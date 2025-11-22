import { NextRequest, NextResponse } from "next/server";
import { generateDynamicUI } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisResult } = body;

    if (!analysisResult) {
      return NextResponse.json(
        { error: "Analysis result is required" },
        { status: 400 }
      );
    }

    // Generate dynamic UI using Gemini 3's generative UI capability
    const uiResult = await generateDynamicUI(analysisResult);

    return NextResponse.json({
      success: true,
      ui: uiResult,
      aiProvider: "gemini-3",
    });
  } catch (error) {
    console.error("Gemini 3 UI Generation API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate UI with Gemini 3",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
