'use server';

import { ai } from '@/ai/genkit';
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
// Define Prompt
// -----------------------------
const resumeReviewPrompt = ai.definePrompt({
  name: 'resumeReviewPrompt',
  model: 'gemini-1.5',  // <-- model is here
  input: { schema: AIResumeReviewInputSchema },
  output: { schema: AIResumeReviewOutputSchema },
  prompt: `
You are an AI resume expert. Rewrite & improve resume sections.
Return JSON with "field" and "suggestion".

Resume:
{{resumeText}}
`,
});


export const aiResumeReviewFlow = ai.defineFlow(
  {
    name: 'aiResumeReviewFlow',
    inputSchema: AIResumeReviewInputSchema,
    outputSchema: AIResumeReviewOutputSchema,
  },
  async (input) => {
    console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

    const { output } = await resumeReviewPrompt(input); // ✅ call prompt like a function
    if (!output) {
      throw new Error('AI did not return any suggestions.');
    }
    return output;
  }
);


// -----------------------------
// Export Function
// -----------------------------
export async function reviewResume(
  input: AIResumeReviewInput
): Promise<AIResumeReviewOutput> {
  return aiResumeReviewFlow(input);
}
