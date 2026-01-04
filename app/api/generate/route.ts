import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not set");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 🔁 Model fallback order (low → high)
const MODEL_FALLBACKS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: NextRequest) {
  try {
    if (!apiKey || !genAI) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let lastError: unknown = null;

    // 🔁 Try each model until one works
    for (const modelName of MODEL_FALLBACKS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const chatSession = model.startChat({
          generationConfig,
          history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();

        // --- existing parsing logic ---
        const scenariosMatch = responseText.match(
          /const scenarios: Scenario\[\] = (\[[\s\S]*?\]);/
        );

        if (!scenariosMatch) {
          const arrayMatch = responseText.match(/\[[\s\S]*\]/);
          if (!arrayMatch) {
            throw new Error("No scenarios found");
          }

          const scenarios = eval(`(${arrayMatch[0]})`);
          return NextResponse.json({ scenarios, modelUsed: modelName });
        }

        const scenarios = eval(`(${scenariosMatch[1]})`);
        return NextResponse.json({ scenarios, modelUsed: modelName });

      } catch (err: any) {
        lastError = err;

        const msg = err?.message?.toLowerCase?.() ?? "";

        const isQuotaError =
          msg.includes("quota") ||
          msg.includes("rate") ||
          msg.includes("limit") ||
          msg.includes("resource_exhausted");

        if (!isQuotaError) {
          throw err; // real error → stop
        }

        console.warn(
          `⚠️ ${modelName} hit rate/quota limit, trying next model...`
        );
      }
    }

    return NextResponse.json(
      {
        error: "All models exceeded quota",
        details:
          lastError instanceof Error ? lastError.message : "Unknown error",
      },
      { status: 429 }
    );

  } catch (error: any) {
    console.error("Error generating scenarios:", error);

    return NextResponse.json(
      {
        error: "Failed to generate scenarios",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
