import { NextRequest, NextResponse } from "next/server";
import { generateCareerContent } from "@/lib/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { career, userContext } = body;

    if (!career) {
      return NextResponse.json(
        { error: "Career name is required" },
        { status: 400 }
      );
    }

    // Generate personalized career content using Gemini 3
    const content = await generateCareerContent(career, userContext || {});

    return NextResponse.json({
      success: true,
      content,
      career,
      aiProvider: "gemini-3",
    });
  } catch (error) {
    console.error("Gemini 3 Content Generation API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate content with Gemini 3",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
