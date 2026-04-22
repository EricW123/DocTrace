import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImpactSchema } from "../schems";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function impactAnalysis(changes: any[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const prompt = `
You are a software impact analysis system.

Return ONLY JSON.

Schema:
{
  "impact_level": "low" | "medium" | "high" | "critical",
  "affected_areas": string[],
  "suggested_actions": string[]
}

Input:
${JSON.stringify(changes)}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(cleaned);
    return ImpactSchema.parse(parsed);
}