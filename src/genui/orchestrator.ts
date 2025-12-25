import { Output, generateText } from "ai";
import { UIComponentSchema, type UIComponentSchemaType } from "@/genui/schema";
import { getModel } from "@/lib/model/cerebras";
import { DASHBOARD_SYSTEM_PROMPT, REFINEMENT_SYSTEM_PROMPT } from "@/genui/prompts";

const PLANNER_MODEL = await getModel("qwen-3-235b-a22b-instruct-2507");

// Error fallback UI when generation fails
const ERROR_FALLBACK_UI: UIComponentSchemaType = {
  type: "Page",
  props: { title: "Generation Error" },
  children: [
    { type: "Header", props: { text: "Unable to Generate Dashboard" } },
    {
      type: "Alert",
      props: {
        severity: "error",
        title: "Generation Failed",
        message: "The AI was unable to generate a valid dashboard. Please try a simpler request or use a template.",
        dismissible: false
      }
    },
    { type: "Text", props: { content: "Tips: Try requests like 'Create a simple sales dashboard with 3 KPI cards'", align: "left" } }
  ]
};

// Maximum retry attempts for generation
const MAX_RETRIES = 2;

/**
 * Generate UI from natural language prompt
 */
export async function generateGenUI(
  prompt: string,
  options?: { retry?: number }
): Promise<UIComponentSchemaType> {
  const retryCount = options?.retry ?? 0;

  try {
    console.log(`[GenUI] Generating UI for: "${prompt}" (attempt ${retryCount + 1})`);

    const result = await generateText({
      model: PLANNER_MODEL,
      output: Output.object({ schema: UIComponentSchema }),
      system: DASHBOARD_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: `Create a dashboard for: ${prompt}\n(Current Date: ${new Date().toISOString()})` }
      ]
    });

    // Parse and validate the response
    let parsedSchema: UIComponentSchemaType;

    try {
      const jsonData = typeof result.text === 'string'
        ? JSON.parse(result.text)
        : result.text;
      parsedSchema = UIComponentSchema.parse(jsonData);
    } catch (parseError) {
      console.error("[GenUI] Parse error:", parseError);

      // Retry if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`[GenUI] Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        return generateGenUI(prompt, { retry: retryCount + 1 });
      }

      throw parseError;
    }

    console.log("[GenUI] Successfully generated UI schema");
    return parsedSchema;

  } catch (error) {
    console.error("[GenUI] Generation failed:", error);

    // Return error fallback UI instead of throwing
    return ERROR_FALLBACK_UI;
  }
}

/**
 * Refine existing UI based on user instructions
 */
export async function refineGenUI(
  currentSchema: UIComponentSchemaType,
  instruction: string
): Promise<UIComponentSchemaType> {
  try {
    console.log(`[GenUI] Refining UI with instruction: "${instruction}"`);

    const result = await generateText({
      model: PLANNER_MODEL,
      output: Output.object({ schema: UIComponentSchema }),
      system: REFINEMENT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Current dashboard:\n${JSON.stringify(currentSchema, null, 2)}\n\nModification request: ${instruction}\n(Current Date: ${new Date().toISOString()})`
        }
      ]
    });

    const jsonData = typeof result.text === 'string'
      ? JSON.parse(result.text)
      : result.text;

    const parsedSchema = UIComponentSchema.parse(jsonData);
    console.log("[GenUI] Successfully refined UI schema");
    return parsedSchema;

  } catch (error) {
    console.error("[GenUI] Refinement failed:", error);
    // Return original schema on failure
    return currentSchema;
  }
}

/**
 * Generate UI from a template
 */
export async function generateFromTemplate(templatePrompt: string): Promise<UIComponentSchemaType> {
  return generateGenUI(templatePrompt);
}
