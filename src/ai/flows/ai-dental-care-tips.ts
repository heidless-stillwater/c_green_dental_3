// src/ai/flows/ai-dental-care-tips.ts
'use server';
/**
 * @fileOverview Provides personalized oral hygiene recommendations.
 *
 * - getDentalCareTips - A function that provides personalized oral hygiene recommendations.
 * - DentalCareTipsInput - The input type for the getDentalCareTips function.
 * - DentalCareTipsOutput - The return type for the getDentalCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DentalCareTipsInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  dietaryHabits: z.string().describe('Description of the user\'s dietary habits.'),
  oralHygieneRoutine: z.string().describe('Description of the user\'s current oral hygiene routine.'),
  dentalHistory: z.string().describe('Description of the user\'s dental history, including any existing conditions.'),
});
export type DentalCareTipsInput = z.infer<typeof DentalCareTipsInputSchema>;

const DentalCareTipsOutputSchema = z.object({
  recommendations: z.string().describe('Personalized oral hygiene recommendations.'),
});
export type DentalCareTipsOutput = z.infer<typeof DentalCareTipsOutputSchema>;

export async function getDentalCareTips(input: DentalCareTipsInput): Promise<DentalCareTipsOutput> {
  return dentalCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dentalCareTipsPrompt',
  input: {schema: DentalCareTipsInputSchema},
  output: {schema: DentalCareTipsOutputSchema},
  prompt: `You are an AI assistant providing personalized oral hygiene recommendations based on the user's information.

  Based on the following information, provide personalized oral hygiene recommendations:

  Age: {{{age}}}
  Dietary Habits: {{{dietaryHabits}}}
  Oral Hygiene Routine: {{{oralHygieneRoutine}}}
  Dental History: {{{dentalHistory}}}

  Provide detailed and actionable recommendations that the user can easily follow.`,
});

const dentalCareTipsFlow = ai.defineFlow(
  {
    name: 'dentalCareTipsFlow',
    inputSchema: DentalCareTipsInputSchema,
    outputSchema: DentalCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
