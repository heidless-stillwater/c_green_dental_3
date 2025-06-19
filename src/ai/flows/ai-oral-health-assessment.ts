// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Provides an AI-powered preliminary oral health assessment tool.
 *
 * - assessOralHealth - A function that handles the oral health assessment process.
 * - OralHealthAssessmentInput - The input type for the assessOralHealth function.
 * - OralHealthAssessmentOutput - The return type for the assessOralHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OralHealthAssessmentInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A description of any symptoms the user is experiencing, such as pain, sensitivity, bleeding, or swelling.'
    ),
  oralHygieneRoutine: z
    .string()
    .describe(
      'A description of the users current oral hygiene routine including frequency of brushing and flossing.'
    ),
  diet: z
    .string()
    .describe(
      'A description of the users diet and consumption of sugary drinks.'
    ),
  medicalConditions: z
    .string()
    .describe(
      'A description of any existing medical conditions the user has.'
    ),
  medications: z
    .string()
    .describe('A list of any medications the user is currently taking.'),
});
export type OralHealthAssessmentInput = z.infer<typeof OralHealthAssessmentInputSchema>;

const OralHealthAssessmentOutputSchema = z.object({
  summary: z.string().describe('A summary of the users oral health status.'),
  recommendations: z
    .string()
    .describe('Recommendations for improvement based on the assessment.'),
  riskFactors: z
    .string()
    .describe('Identified risk factors for oral health problems.'),
  nextSteps: z
    .string()
    .describe(
      'Suggested next steps, such as consulting a dentist or improving oral hygiene practices.'
    ),
});
export type OralHealthAssessmentOutput = z.infer<typeof OralHealthAssessmentOutputSchema>;

export async function assessOralHealth(input: OralHealthAssessmentInput): Promise<OralHealthAssessmentOutput> {
  return assessOralHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'oralHealthAssessmentPrompt',
  input: {schema: OralHealthAssessmentInputSchema},
  output: {schema: OralHealthAssessmentOutputSchema},
  prompt: `You are an AI-powered oral health assessment tool. Analyze the following information provided by the user and provide a summary of their oral health status, recommendations for improvement, identified risk factors, and suggested next steps.

Symptoms: {{{symptoms}}}
Oral Hygiene Routine: {{{oralHygieneRoutine}}}
Diet: {{{diet}}}
Medical Conditions: {{{medicalConditions}}}
Medications: {{{medications}}}`,
});

const assessOralHealthFlow = ai.defineFlow(
  {
    name: 'assessOralHealthFlow',
    inputSchema: OralHealthAssessmentInputSchema,
    outputSchema: OralHealthAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
