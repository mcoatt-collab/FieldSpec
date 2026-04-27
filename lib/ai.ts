import { z } from "zod";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = "deepseek-chat";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export const ImageRelevanceSchema = z.enum(["relevant_inspection_image", "irrelevant_image", "unclear_image"]);
export type ImageRelevance = z.infer<typeof ImageRelevanceSchema>;

export const AIResponseSchema = z.object({
  relevance: ImageRelevanceSchema,
  caption: z.string().min(1),
  finding: z.string().min(1),
  recommendation: z.string().min(1),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

interface GenerateCaptionInput {
  category: string | null;
  userNote: string | null;
  context?: string;
}

const RELEVANCE_SYSTEM_PROMPT = `You are a field inspection image classifier. Your task is to analyze images and classify them as:

- relevant_inspection_image: Shows farmland, crops, land/terrain, infrastructure (roads, buildings, pipelines), aerial/drone survey views, or environmental/site inspection content
- irrelevant_image: Indoor scenes, personal photos, unrelated objects with no inspection context
- unclear_image: Cannot determine if image is relevant or not

First classify the image, then provide analysis.`;

export async function generateCaption(input: GenerateCaptionInput): Promise<AIResponse | null> {
  if (!DEEPSEEK_API_KEY) {
    console.error("[AI] DEEPSEEK_API_KEY not configured");
    return null;
  }

  const { category, userNote, context } = input;

  const prompt = `Analyze this inspection image.

Category: ${category || "general"}
User Note: ${userNote || "None"}
Context: ${context || "Field inspection"}

First determine if this image is relevant to a field or site inspection:
- RELEVANT if it shows: farmland, crops, land, terrain, infrastructure, aerial views, environmental content
- IRRELEVANT if it shows: indoor scenes, personal photos, unrelated objects
- UNCLEAR if you cannot determine

Respond with ONLY a JSON object in this exact format:
{
  "relevance": "relevant_inspection_image" OR "irrelevant_image" OR "unclear_image",
  "caption": "Brief description of what the image shows (max 100 chars)",
  "finding": "Key observation or issue identified (max 200 chars)",
  "recommendation": "Suggested action or follow-up (max 200 chars)"
}

For irrelevant images, use these safe outputs:
- caption: "This image does not appear to be relevant to a field or site inspection."
- finding: "No inspection-related insights could be derived."
- recommendation: "Exclude this image from the report."

Do NOT include any text outside the JSON object. Do NOT use markdown formatting.`;

  try {
    const response = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: RELEVANCE_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[AI] DeepSeek API error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("[AI] No content in DeepSeek response");
      return null;
    }

    const parsed = JSON.parse(content);
    const result = AIResponseSchema.safeParse(parsed);

    if (!result.success) {
      console.error("[AI] Response validation failed:", result.error.issues);
      return null;
    }

    // Check if image is relevant to field inspection
    if (result.data.relevance === "irrelevant_image") {
      console.log("[AI] Image classified as irrelevant");
      return {
        relevance: "irrelevant_image",
        caption: result.data.caption,
        finding: "This image does not appear to be relevant to a field or site inspection.",
        recommendation: "Exclude this image from the report.",
      };
    }

    if (result.data.relevance === "unclear_image") {
      console.log("[AI] Image classification unclear");
    }

    return result.data;
  } catch (error) {
    console.error("[AI] Request failed:", error);
    return null;
  }
}

export async function generateCaptionWithRetry(input: GenerateCaptionInput, maxRetries = 2): Promise<AIResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await generateCaption(input);
    
    if (result) {
      return result;
    }

    if (attempt < maxRetries - 1) {
      console.log(`[AI] Retry ${attempt + 1}/${maxRetries} after failure`);
    }
  }

  console.warn("[AI] All retries failed, using fallback");
  return {
    relevance: "unclear_image",
    caption: "Analysis pending",
    finding: "Unable to generate findings automatically",
    recommendation: "Please review manually",
  };
}

export function calculateConfidenceScore(category: string | null, hasNote: boolean, hasContext: boolean): number {
  let score = 0.3;

  if (category && category !== "general") {
    score += 0.3;
  }

  if (hasNote) {
    score += 0.25;
  }

  if (hasContext) {
    score += 0.15;
  }

  return Math.min(score, 1);
}