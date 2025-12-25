import { NextResponse } from "next/server";
import { generateGenUI, refineGenUI } from "@/genui/orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, currentSchema, action } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let ui;

    if (action === "refine" && currentSchema) {
      // Refine existing dashboard
      ui = await refineGenUI(currentSchema, prompt);
    } else {
      // Generate new dashboard
      ui = await generateGenUI(prompt);
    }

    console.log("[API] Generated UI type:", ui.type);
    return NextResponse.json(ui);

  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate UI" },
      { status: 500 }
    );
  }
}
