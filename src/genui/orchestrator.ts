import { Output, generateText } from "ai";
import { UIComponentSchema,UISchema, type UIGenResult } from "@/genui/schema";
import { getModel } from "@/lib/model/cerebras";
import { UIComponentSchemaType } from "@/genui/schema";
const PLANNER_MODEL = await getModel("qwen-3-235b-a22b-instruct-2507");
const WRITER_MODEL  = await getModel("qwen-3-235b-a22b-instruct-2507");

export async function generateGenUI(prompt: string): Promise<UIComponentSchemaType> {

const planner = await generateText({ 
    model: PLANNER_MODEL,
    output: Output.object({schema: UIComponentSchema}),
    system: `
      You are a GenUI planner.
      Rules:
      give response in json
    `,
    messages: [
      { role: "user", content: `Design UI for: ${prompt}` }
    ]
});



  const parsed = UIComponentSchema.parse(
    JSON.parse(planner.text)
  );
  console.log("Generated UI Schema:", JSON.stringify(parsed, null, 2));
  return parsed as UIComponentSchemaType;
}
