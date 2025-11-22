import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Gemini model - using the latest available model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export interface CareerAnalysisInput {
  answers: Record<string, any>;
  userProfile?: {
    age?: number;
    education?: string;
    interests?: string[];
  };
}

export interface GenerativeUIResult {
  html: string;
  animations: string[];
  interactiveElements: any[];
}

/**
 * Analyze career test results using Gemini 3's advanced reasoning
 */
export async function analyzeCareerWithGemini3(input: CareerAnalysisInput) {
  try {
    const prompt = `You are an expert career counselor using advanced AI to provide personalized career guidance.

Analyze the following career test results and provide a comprehensive career analysis:

User Answers: ${JSON.stringify(input.answers, null, 2)}
${input.userProfile ? `User Profile: ${JSON.stringify(input.userProfile, null, 2)}` : ''}

Based on this data, provide:
1. **Personality Type**: Identify the best matching personality type from these 8 categories:
   - Realistit (Practical Doers)
   - Tutkijat (Analytical Thinkers)
   - Taite import ilijat (Creative Artists)
   - Sosiaaliset (People Helpers)
   - Yrittäjät (Enterprising Leaders)
   - Perinteiset (Organized Planners)
   - Luovat (Innovators)
   - Tekniset (Technical Specialists)

2. **Top 5 Career Recommendations**: Match from the 361 careers in our database with match percentages

3. **Strengths & Skills**: Key strengths identified

4. **Learning Path**: Recommended education and skill development

5. **Career Roadmap**: Step-by-step career progression

Return the response as a JSON object with this structure:
{
  "personalityType": "string",
  "matchPercentage": number,
  "topCareers": [{ "name": "string", "match": number, "description": "string", "salary": "string", "education": "string" }],
  "strengths": ["string"],
  "learningPath": { "immediate": ["string"], "shortTerm": ["string"], "longTerm": ["string"] },
  "careerRoadmap": [{ "stage": "string", "timeline": "string", "actions": ["string"] }],
  "insights": "string (detailed personal insights)"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Failed to parse Gemini response");
  } catch (error) {
    console.error("Gemini 3 Analysis Error:", error);
    throw error;
  }
}

/**
 * Generate dynamic UI components using Gemini 3's generative UI capability
 */
export async function generateDynamicUI(analysisResult: any): Promise<GenerativeUIResult> {
  try {
    const prompt = `You are a UI/UX expert specializing in creating engaging, animated career guidance interfaces.

Based on this career analysis result:
${JSON.stringify(analysisResult, null, 2)}

Generate a beautiful, interactive HTML/React-style UI component that:
1. Uses modern animations (fade-in, slide-in, scale, etc.)
2. Includes interactive elements (hover effects, click animations)
3. Visualizes career matches with animated progress bars
4. Shows personality type with an animated icon
5. Displays career roadmap as an interactive timeline
6. Uses our brand colors: #2B5F75 (blue), #E8994A (amber), #4A7C59 (green)
7. Includes glass morphism effects for cards
8. Has smooth transitions and micro-interactions

Return a JSON object with:
{
  "componentCode": "string (JSX/React component code)",
  "animations": ["string array of CSS animation names needed"],
  "interactiveElements": [{ "type": "string", "action": "string", "effect": "string" }],
  "styling": "string (additional Tailwind classes or CSS)"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const uiData = JSON.parse(jsonMatch[0]);
      return {
        html: uiData.componentCode || "",
        animations: uiData.animations || [],
        interactiveElements: uiData.interactiveElements || [],
      };
    }

    throw new Error("Failed to parse UI generation response");
  } catch (error) {
    console.error("Gemini 3 UI Generation Error:", error);
    throw error;
  }
}

/**
 * Generate personalized career exploration content
 */
export async function generateCareerContent(career: string, userContext: any) {
  try {
    const prompt = `Generate engaging, personalized content about the career: "${career}"

User Context: ${JSON.stringify(userContext, null, 2)}

Create content that includes:
1. A compelling introduction tailored to the user
2. Day-in-the-life scenarios
3. Skills needed (with user's current skills highlighted)
4. Career growth opportunities
5. Salary expectations in Finland
6. Education requirements
7. Industry trends
8. Inspiring success stories

Make it personal, engaging, and actionable. Return as markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini 3 Content Generation Error:", error);
    throw error;
  }
}

/**
 * Create interactive career path visualization
 */
export async function generateCareerPathVisualization(userGoals: string[], currentSkills: string[]) {
  try {
    const prompt = `Create an interactive career path visualization data structure.

User Goals: ${JSON.stringify(userGoals)}
Current Skills: ${JSON.stringify(currentSkills)}

Generate a step-by-step career progression path with:
1. Milestones (with animations for each)
2. Skill acquisition points
3. Decision nodes (interactive branching paths)
4. Timeline estimates
5. Resources needed at each stage

Return as JSON:
{
  "path": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "timeline": "string",
      "skillsRequired": ["string"],
      "skillsGained": ["string"],
      "animation": "string (animation type)",
      "interactive": boolean,
      "branches": [{ "condition": "string", "nextId": "string" }]
    }
  ],
  "visualizationType": "string (timeline, tree, flow, etc.)",
  "interactionHints": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Failed to parse career path visualization");
  } catch (error) {
    console.error("Gemini 3 Path Visualization Error:", error);
    throw error;
  }
}

export default {
  analyzeCareerWithGemini3,
  generateDynamicUI,
  generateCareerContent,
  generateCareerPathVisualization,
};
