import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not set in environment variables");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const model = genAI?.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: NextRequest) {
  try {
    if (!apiKey || !genAI || !model) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is not configured",
          setup:
            "Visit https://makersuite.google.com/app/apikey to get your API key",
        },
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

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    // Extract the scenarios array
    const scenariosMatch = responseText.match(
      /const scenarios: Scenario\[\] = (\[[\s\S]*?\]);/
    );

    if (!scenariosMatch) {
      const arrayMatch = responseText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          const scenarios = eval(`(${arrayMatch[0]})`);
          return NextResponse.json({ scenarios, raw: responseText });
        } catch {
          return NextResponse.json(
            {
              error: "Failed to parse scenarios",
              raw: responseText,
            },
            { status: 500 }
          );
        }
      }
      return NextResponse.json(
        { error: "No scenarios found", raw: responseText },
        { status: 500 }
      );
    }

    try {
      const scenarios = eval(`(${scenariosMatch[1]})`);
      return NextResponse.json({ scenarios, raw: responseText });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to parse scenarios",
          details: error instanceof Error ? error.message : "Unknown error",
          raw: responseText,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating scenarios:", error);

    if (error.message?.includes("API key not valid")) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          message: "Please check your GEMINI_API_KEY in .env.local",
          setup: "Visit https://makersuite.google.com/app/apikey",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate scenarios",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
