import { NextRequest, NextResponse } from "next/server";
import { analyzeCareerWithGemini3 } from "@/lib/gemini";
import { createLogger } from "@/lib/logger";

const log = createLogger("API/Gemini");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, userProfile } = body;

    if (!answers) {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Analyze career using Gemini 3
    const analysis = await analyzeCareerWithGemini3({
      answers,
      userProfile,
    });

    return NextResponse.json({
      success: true,
      analysis,
      aiProvider: "gemini-3",
    });
  } catch (error) {
    log.error("Analysis API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze career with Gemini 3",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
