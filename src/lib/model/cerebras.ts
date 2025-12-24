import { createCerebras } from "@ai-sdk/cerebras";

let modelInstance: ReturnType<ReturnType<typeof createCerebras>> | null = null;

export async function getModel(modelId: string) {
    const cerebrasModel = createCerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});
    modelInstance = cerebrasModel(modelId);
    return modelInstance;
}


