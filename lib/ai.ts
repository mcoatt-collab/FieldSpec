import { z } from "zod";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_MODEL = "deepseek-chat";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export const AIResponseSchema = z.object({
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

export async function generateCaption(input: GenerateCaptionInput): Promise<AIResponse | null> {
  if (!DEEPSEEK_API_KEY) {
    console.error("[AI] DEEPSEEK_API_KEY not configured");
    return null;
  }

  const { category, userNote, context } = input;

  const prompt = `You are an agricultural field inspection AI. Analyze the image and provide structured findings.

Based on the following information:
- Category: ${category || "general"}
- User Note: ${userNote || "None"}
- Context: ${context || "Field inspection"}

Respond with ONLY a JSON object in this exact format:
{
  "caption": "A brief description of what the image shows (max 100 chars)",
  "finding": "Key observation or issue identified (max 200 chars)",
  "recommendation": "Suggested action or follow-up (max 200 chars)"
}

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
          { role: "system", content: "You are a precise agricultural analysis AI. Always respond with valid JSON only." },
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