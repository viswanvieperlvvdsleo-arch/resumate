'use server';

/**
 * @fileOverview This file implements the AI resume review flow using Genkit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// -----------------------------
// 1️⃣ Define Schemas
// -----------------------------
const AIResumeReviewInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be reviewed.'),
});
export type AIResumeReviewInput = z.infer<typeof AIResumeReviewInputSchema>;

const SuggestionSchema = z.object({
  field: z.string().describe(
    "The field this suggestion applies to. Use dot notation for nested fields, e.g., 'contact.email', 'education.0.degree', 'projects.1.description'."
  ),
  suggestion: z.string().describe('The suggested improved text for the specified field.'),
});

const AIResumeReviewOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of suggestions for improving the resume.'),
});
export type AIResumeReviewOutput = z.infer<typeof AIResumeReviewOutputSchema>;
export type AISuggestion = z.infer<typeof SuggestionSchema>;

// -----------------------------
// 2️⃣ Define the AI Prompt
// -----------------------------
const resumeReviewPrompt = ai.definePrompt({
  name: 'resumeReviewPrompt',
  input: { schema: AIResumeReviewInputSchema },
  output: { schema: AIResumeReviewOutputSchema },
  prompt: `You are an AI resume expert. Review the following resume and provide concrete suggestions for improving wording, structure, and content.
For each suggestion, you MUST provide the improved text in the 'suggestion' field.
For each suggestion, specify the exact 'field' it pertains to, using dot notation for nested items like 'projects.0.description' or 'education.1.degree'.

Do not just give advice. Provide the actual rewritten text.

Example:
If the resume has 'Title: web dev', you should suggest a better title.
Your output for this would be:
{
  "field": "title",
  "suggestion": "Frontend Developer"
}

Resume:
{{resumeText}}`,
});

// -----------------------------
// 3️⃣ Define the AI Flow
// -----------------------------
const aiResumeReviewFlow = ai.defineFlow(
  {
    name: 'aiResumeReviewFlow',
    inputSchema: AIResumeReviewInputSchema,
    outputSchema: AIResumeReviewOutputSchema,
  },
  async (input) => {
    // Simply call the prompt with the input — no apiKey here
    const { output } = await resumeReviewPrompt(input);
    return output!;
  }
);

// -----------------------------
// 4️⃣ Exported function
// -----------------------------
export async function reviewResume(input: AIResumeReviewInput): Promise<AIResumeReviewOutput> {
  return aiResumeReviewFlow(input);
}
