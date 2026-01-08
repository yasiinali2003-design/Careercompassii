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
    const prompt = `Olet asiantunteva uraohjaaja, joka käyttää tekoälyä henkilökohtaisen uraohjauksen tarjoamiseen.
TÄRKEÄÄ: Kirjoita kaikki vastaukset SUOMEKSI. Käytä erinomaista suomen kieltä kaikissa teksteissä.

Analysoi seuraavat uratestin tulokset ja anna kattava ura-analyysi:

Käyttäjän vastaukset: ${JSON.stringify(input.answers, null, 2)}
${input.userProfile ? `Käyttäjän profiili: ${JSON.stringify(input.userProfile, null, 2)}` : ''}

Anna vastaus seuraavista:
1. **Persoonallisuustyyppi**: Tunnista parhaiten sopiva persoonallisuustyyppi näistä 8 kategoriasta:
   - Realistit (Käytännön tekijät)
   - Tutkijat (Analyyttiset ajattelijat)
   - Taiteilijat (Luovat tekijät)
   - Sosiaaliset (Ihmisten auttajat)
   - Yrittäjät (Johtavat vaikuttajat)
   - Perinteiset (Järjestelmälliset suunnittelijat)
   - Luovat (Innovaattorit)
   - Tekniset (Tekniikan asiantuntijat)

2. **Top 5 urasuositusta**: Sovita 361 ammatin tietokannastamme prosentuaalisilla osuvuuksilla

3. **Vahvuudet ja taidot**: Tunnistetut keskeiset vahvuudet (SUOMEKSI)

4. **Oppimispolku**: Suositellut koulutus- ja taitokehityspolut

5. **Urapolku**: Vaiheittainen uraetenemä

Palauta vastaus JSON-objektina tällä rakenteella (KAIKKI TEKSTIT SUOMEKSI):
{
  "personalityType": "persoonallisuustyyppi suomeksi",
  "matchPercentage": numero,
  "topCareers": [{ "name": "ammatin nimi suomeksi", "match": numero, "description": "kuvaus suomeksi", "salary": "palkka suomeksi", "education": "koulutus suomeksi" }],
  "strengths": ["vahvuus suomeksi", "toinen vahvuus suomeksi"],
  "learningPath": { "immediate": ["toimenpide suomeksi"], "shortTerm": ["toimenpide suomeksi"], "longTerm": ["toimenpide suomeksi"] },
  "careerRoadmap": [{ "stage": "vaihe suomeksi", "timeline": "aikataulu suomeksi", "actions": ["toimenpide suomeksi"] }],
  "insights": "henkilökohtaiset oivallukset suomeksi"
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
    const prompt = `Luo kiinnostavaa, henkilökohtaista sisältöä ammatista: "${career}"
TÄRKEÄÄ: Kirjoita kaikki SUOMEKSI erinomaisella kieliopilla.

Käyttäjän konteksti: ${JSON.stringify(userContext, null, 2)}

Luo sisältöä, joka sisältää:
1. Houkutteleva johdanto käyttäjälle räätälöitynä
2. Päivä ammatin parissa -skenaarioita
3. Tarvittavat taidot (käyttäjän nykyiset taidot korostettuina)
4. Urakehitysmahdollisuudet
5. Palkkaodotukset Suomessa
6. Koulutusvaatimukset
7. Alan trendit
8. Inspiroivia menestystarinoita

Tee siitä henkilökohtainen, kiinnostava ja toiminnallinen. Palauta markdown-muodossa SUOMEKSI.`;

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

const geminiUtils = {
  analyzeCareerWithGemini3,
  generateDynamicUI,
  generateCareerContent,
  generateCareerPathVisualization,
};

export default geminiUtils;
