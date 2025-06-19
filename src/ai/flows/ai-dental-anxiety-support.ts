
'use server';
/**
 * @fileOverview Provides AI-powered support for dental anxiety.
 *
 * - getDentalAnxietySupport - A function that offers relaxation and coping strategies.
 * - DentalAnxietySupportInput - The input type for the function.
 * - DentalAnxietySupportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DentalAnxietySupportInputSchema = z.object({
  anxietyDescription: z.string().min(10, { message: "Please describe what makes you anxious about dental visits (at least 10 characters)." }).describe('A description of the user\'s dental anxiety triggers or feelings.'),
});
export type DentalAnxietySupportInput = z.infer<typeof DentalAnxietySupportInputSchema>;

const DentalAnxietySupportOutputSchema = z.object({
  copingStrategies: z.string().describe('Actionable coping strategies the user can try before and during a dental appointment.'),
  relaxationTechniques: z.string().describe('Specific relaxation techniques (e.g., breathing exercises, visualization).'),
  positiveAffirmations: z.string().describe('Positive affirmations to help reframe anxious thoughts.'),
  communicationTips: z.string().describe('Tips on how to communicate their anxiety with the dental team.'),
  disclaimer: z.string().describe('A disclaimer stating this is AI-generated support and not a substitute for professional psychological help or direct communication with their dentist.'),
});
export type DentalAnxietySupportOutput = z.infer<typeof DentalAnxietySupportOutputSchema>;

export async function getDentalAnxietySupport(input: DentalAnxietySupportInput): Promise<DentalAnxietySupportOutput> {
  return dentalAnxietySupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dentalAnxietySupportPrompt',
  input: {schema: DentalAnxietySupportInputSchema},
  output: {schema: DentalAnxietySupportOutputSchema},
  prompt: `You are a caring and supportive AI assistant helping users manage dental anxiety.
  Your goal is to provide practical, calming, and empowering advice.
  You are NOT a therapist, and your advice should not replace professional help or direct communication with a dentist.

  User's description of their anxiety: {{{anxietyDescription}}}

  Based on this, please provide the following in a kind and empathetic tone:

  1.  **Coping Strategies**: Offer 3-4 actionable coping strategies the user can employ before and during their dental visit (e.g., listening to music, using a stress ball, scheduling appointments at low-stress times).
  2.  **Relaxation Techniques**: Suggest 2-3 specific relaxation techniques with brief instructions (e.g., deep diaphragmatic breathing, progressive muscle relaxation, guided imagery/visualization).
  3.  **Positive Affirmations**: Provide 3-4 short, positive affirmations the user can repeat to themselves (e.g., "I am in control," "This feeling will pass," "I am taking care of my health").
  4.  **Communication Tips**: Offer advice on how to effectively communicate their anxiety and needs to the dental staff (e.g., "It's okay to tell your dentist you're feeling anxious," "Ask about hand signals to pause treatment").
  5.  **Disclaimer**: Include this exact disclaimer: "This guidance is AI-generated and intended for informational support only. It is not a substitute for professional psychological counseling or medical advice from your dentist. Please discuss your anxieties and any concerns directly with your dental care provider and, if needed, a mental health professional."

  Structure your response according to the output schema. Be reassuring and focus on empowering the user.
  Avoid medical diagnoses or overly clinical language.
  `,
});

const dentalAnxietySupportFlow = ai.defineFlow(
  {
    name: 'dentalAnxietySupportFlow',
    inputSchema: DentalAnxietySupportInputSchema,
    outputSchema: DentalAnxietySupportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate dental anxiety support advice.');
    }
    // Ensure the disclaimer is always present and correct
    return {
      ...output,
      disclaimer: output.disclaimer || "This guidance is AI-generated and intended for informational support only. It is not a substitute for professional psychological counseling or medical advice from your dentist. Please discuss your anxieties and any concerns directly with your dental care provider and, if needed, a mental health professional."
    };
  }
);
