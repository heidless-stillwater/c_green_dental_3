// src/ai/flows/ai-emergency-dental-advisor.ts
'use server';
/**
 * @fileOverview Provides immediate guidance for dental emergencies.
 *
 * - aiEmergencyDentalAdvisor - A function that provides guidance for dental emergencies.
 * - AIEmergencyDentalAdvisorInput - The input type for the aiEmergencyDentalAdvisor function.
 * - AIEmergencyDentalAdvisorOutput - The return type for the aiEmergencyDentalAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIEmergencyDentalAdvisorInputSchema = z.object({
  emergencyDescription: z
    .string()
    .describe('A description of the dental emergency, including symptoms and any relevant details.'),
});
export type AIEmergencyDentalAdvisorInput = z.infer<typeof AIEmergencyDentalAdvisorInputSchema>;

const AIEmergencyDentalAdvisorOutputSchema = z.object({
  immediateGuidance: z
    .string()
    .describe('Immediate guidance and steps to take while waiting for professional dental help.'),
  disclaimer: z
    .string()
    .describe('A disclaimer advising users to seek professional dental care as soon as possible.'),
});
export type AIEmergencyDentalAdvisorOutput = z.infer<typeof AIEmergencyDentalAdvisorOutputSchema>;

export async function aiEmergencyDentalAdvisor(
  input: AIEmergencyDentalAdvisorInput
): Promise<AIEmergencyDentalAdvisorOutput> {
  return aiEmergencyDentalAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEmergencyDentalAdvisorPrompt',
  input: {schema: AIEmergencyDentalAdvisorInputSchema},
  output: {schema: AIEmergencyDentalAdvisorOutputSchema},
  prompt: `You are a helpful AI assistant providing immediate guidance for dental emergencies.

  Based on the user's description of their dental emergency, provide clear and concise steps they can take while waiting for professional help.
  Include a disclaimer advising them to seek professional dental care as soon as possible.

  Emergency Description: {{{emergencyDescription}}}
  `,
});

const aiEmergencyDentalAdvisorFlow = ai.defineFlow(
  {
    name: 'aiEmergencyDentalAdvisorFlow',
    inputSchema: AIEmergencyDentalAdvisorInputSchema,
    outputSchema: AIEmergencyDentalAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
