import Groq from "groq-sdk";
import { z } from '@genkit-ai/core';

// -----------------------------
// Schemas
// -----------------------------
const AIResumeReviewInputSchema = z.object({
  resumeText: z.string(),
});

export type AIResumeReviewInput = z.infer<typeof AIResumeReviewInputSchema>;

const SuggestionSchema = z.object({
  field: z.string(),
  suggestion: z.string(),
});

const AIResumeReviewOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});

export type AIResumeReviewOutput = z.infer<typeof AIResumeReviewOutputSchema>;
export type AISuggestion = z.infer<typeof SuggestionSchema>;

// -----------------------------
// Groq Client
// -----------------------------
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// -----------------------------
// Helper: Fetch AI Response with Retry
// -----------------------------
async function fetchAIResponse(prompt: string, retries = 2): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });
      const raw = response.choices[0]?.message?.content;
      if (!raw) throw new Error("Empty AI response");
      return raw;
    } catch (err) {
      if (i === retries) throw err;
      console.warn("Retrying AI request due to error:", err);
    }
  }
  throw new Error("Failed after retries");
}

// -----------------------------
// Main Function
// -----------------------------
export async function reviewResume(
  input: AIResumeReviewInput
): Promise<AIResumeReviewOutput> {

  const prompt = `You are an expert resume reviewer and professional career writer.
Analyze the given resume text and return a JSON containing professional suggestions for each section. 

Requirements:
1. Correct all spelling and grammar mistakes.
2. Rewrite in a professional, advanced, and impactful style suitable for a high-quality resume.
3. Do not provide explanations or extra text—only the improved version.
4. Keep the original meaning intact.
5. For the contact section, create separate entries for email, GitHub, LinkedIn, and phone. Construct email using username (e.g., "viswan" -> "viswan@gmail.com").

Target JSON Format:
{
  "suggestions": [
    { "field": "section_name", "suggestion": "improved_text_only" }
  ]
}

{
  "suggestions": [
    { "field": "email", "suggestion": "viswan@gmail.com" },
    { "field": "github", "suggestion": "github.com/viswan" },
    { "field": "linkedin", "suggestion": "linkedin.com/in/viswan" },
    { "field": "phone", "suggestion": "(123) 456-7890" }
  ]
}



Resume Content:
"${input.resumeText}"`;

  try {
    const raw = await fetchAIResponse(prompt);

    console.log("AI RAW OUTPUT:", raw);

    // Robust JSON parsing
    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      const cleaned = raw.replace(/(\r\n|\n|\r)/gm, "").replace(/'/g, '"');
      json = JSON.parse(cleaned);
    }

    // Validate against schema
    const parsedData = AIResumeReviewOutputSchema.parse(json);
    return parsedData;

  } catch (err) {
    console.error("AI FAILED:", err);
    throw new Error("Failed to get AI suggestions.");
  }
}



