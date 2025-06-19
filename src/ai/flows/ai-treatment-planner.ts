'use server';

/**
 * @fileOverview An AI treatment planner for dental conditions.
 *
 * - treatmentPlanner - A function that provides personalized treatment recommendations based on a user's dental condition.
 * - TreatmentPlannerInput - The input type for the treatmentPlanner function.
 * - TreatmentPlannerOutput - The return type for the treatmentPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TreatmentPlannerInputSchema = z.object({
  dentalCondition: z
    .string()
    .describe('Description of the dental condition, symptoms, and any relevant medical history.'),
});

export type TreatmentPlannerInput = z.infer<typeof TreatmentPlannerInputSchema>;

const TreatmentPlannerOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe('Personalized treatment recommendations based on the dental condition.'),
  additionalInformation: z
    .string()
    .optional()
    .describe('Any additional relevant information or considerations.'),
});

export type TreatmentPlannerOutput = z.infer<typeof TreatmentPlannerOutputSchema>;

export async function treatmentPlanner(input: TreatmentPlannerInput): Promise<TreatmentPlannerOutput> {
  return treatmentPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'treatmentPlannerPrompt',
  input: {schema: TreatmentPlannerInputSchema},
  output: {schema: TreatmentPlannerOutputSchema},
  prompt: `You are an AI-powered dental treatment planner. A user will provide you with a description of their dental condition. Based on this information, you will provide personalized treatment recommendations. Please include any additional relevant information or considerations. 

Dental Condition: {{{dentalCondition}}}`,
});

const treatmentPlannerFlow = ai.defineFlow(
  {
    name: 'treatmentPlannerFlow',
    inputSchema: TreatmentPlannerInputSchema,
    outputSchema: TreatmentPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
