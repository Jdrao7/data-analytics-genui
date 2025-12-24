import { NextResponse } from "next/server";
import { generateGenUI } from "@/genui/orchestrator";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const ui = await generateGenUI(prompt);
    console.log("Final UI Schema to return:", NextResponse.json(ui));
    console.log("Final UI Schema to return (stringified):", JSON.stringify(ui, null, 2));
  return NextResponse.json(ui);
}
