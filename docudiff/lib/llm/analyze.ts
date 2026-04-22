import { GoogleGenerativeAI } from "@google/generative-ai";
import { preprocessFiles } from "../diff-preprocess";
import { DiffSchema } from "../schems";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// console.log(genAI.ListModels)

export async function analyzeDiff(files: any[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

    const processed = preprocessFiles(files);

    const prompt = `
You are a strict API/code diff analyzer.

Analyze the following changes and return ONLY valid JSON.

Rules:
- NO explanation
- NO markdown
- JSON only
- Must match schema exactly

Schema:
{
  "summary": string,
  "breaking": boolean,
  "risk_score": number (0-1),
  "changes": [
    {
      "path": string,
      "description": string
    }
  ]
}

Input:
${JSON.stringify(processed)}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;

    try {
        parsed = JSON.parse(cleaned);
    } catch (e) {
        console.error("LLM output invalid:", text);
        throw new Error("Invalid JSON from LLM");
    }

    console.log(">>>>");
    console.log(JSON.stringify(processed));
    return DiffSchema.parse(parsed);
}