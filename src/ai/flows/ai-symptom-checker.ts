'use server';
/**
 * @fileOverview This file implements the AI Symptom Checker flow.
 *
 * - aiSymptomChecker - A function that takes dental symptoms as input and provides a preliminary assessment.
 * - AiSymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AiSymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the dental symptoms the user is experiencing.'),
});
export type AiSymptomCheckerInput = z.infer<typeof AiSymptomCheckerInputSchema>;

const AiSymptomCheckerOutputSchema = z.object({
  assessment: z.string().describe('A preliminary assessment of the symptoms.'),
  urgency: z
    .string()
    .describe(
      'A recommendation on the urgency of seeking dental care (e.g., immediate, within 24 hours, within a week, not urgent).' // Added urgency
    ),
});
export type AiSymptomCheckerOutput = z.infer<typeof AiSymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AiSymptomCheckerInput): Promise<AiSymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AiSymptomCheckerInputSchema},
  output: {schema: AiSymptomCheckerOutputSchema},
  prompt: `You are an AI-powered dental symptom checker. A user will describe their symptoms, and you will provide a preliminary assessment and a recommendation on the urgency of seeking dental care.

Symptoms: {{{symptoms}}}

Based on these symptoms, provide a brief assessment and an urgency recommendation. Consider factors such as pain level, bleeding, swelling, and potential for infection.  Be clear about the limitations of the assessment and always recommend that the user consult with a dentist for proper diagnosis and treatment.

Assessment:

Urgency:`, // Added urgency
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AiSymptomCheckerInputSchema,
    outputSchema: AiSymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
