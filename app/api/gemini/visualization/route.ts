import { NextRequest, NextResponse } from "next/server";
import { generateCareerPathVisualization } from "@/lib/gemini";
import { createLogger } from "@/lib/logger";

const log = createLogger("API/Gemini");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userGoals, currentSkills } = body;

    if (!userGoals || !Array.isArray(userGoals)) {
      return NextResponse.json(
        { error: "User goals array is required" },
        { status: 400 }
      );
    }

    // Generate interactive career path visualization using Gemini 3
    const visualization = await generateCareerPathVisualization(
      userGoals,
      currentSkills || []
    );

    return NextResponse.json({
      success: true,
      visualization,
      aiProvider: "gemini-3",
    });
  } catch (error) {
    log.error("Visualization API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate visualization with Gemini 3",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
