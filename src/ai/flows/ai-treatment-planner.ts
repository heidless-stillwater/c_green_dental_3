
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
    .describe('Potential treatment options and approaches for discussion with a dentist, based on the described dental condition.'),
  additionalInformation: z
    .string()
    .optional()
    .describe('Further considerations, questions to ask a dentist, and the importance of professional consultation.'),
});

export type TreatmentPlannerOutput = z.infer<typeof TreatmentPlannerOutputSchema>;

export async function treatmentPlanner(input: TreatmentPlannerInput): Promise<TreatmentPlannerOutput> {
  return treatmentPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'treatmentPlannerPrompt',
  input: {schema: TreatmentPlannerInputSchema},
  output: {schema: TreatmentPlannerOutputSchema},
  prompt: `You are an AI Dental Treatment Options Suggester. You are NOT a dentist and cannot diagnose conditions or create definitive treatment plans.
A user will describe their dental condition, symptoms, and relevant history.
User's Dental Condition: {{{dentalCondition}}}

Based on this information, your goal is to:
1.  Provide potential **Treatment Recommendations**:
    *   If possible, identify general categories of dental issues that might relate to the user's description.
    *   Suggest common treatment *options* or approaches that a dentist might consider for such issues. For example, if the user mentions a "chipped tooth," you might mention bonding, veneers, or crowns as potential options a dentist would discuss.
    *   Frame these as possibilities for discussion with a dental professional, not as direct advice or a definitive plan.
    *   If multiple options exist for a potential issue, briefly mention them.
    *   Avoid any language that sounds like a diagnosis or prescription.

2.  Provide **Additional Information**:
    *   Suggest general questions the user might want to ask their dentist regarding their condition and potential treatments (e.g., "What are the pros and cons of these options?", "What is the expected recovery time?", "Are there alternative treatments?").
    *   Emphasize the critical importance of a professional in-person examination and diagnosis by a qualified dentist.
    *   Briefly mention general factors that can influence treatment decisions (e.g., overall oral health, complexity of the case, longevity of treatment, aesthetic goals), while stating that the AI cannot assess these for the individual.
    *   Conclude by strongly reiterating that this information is for educational and informational purposes only and is NOT a substitute for a consultation with, or advice from, a qualified dental professional who can perform an examination and provide a personalized treatment plan.

Structure your output according to the schema. Be empathetic, clear, and prioritize user safety by consistently and strongly encouraging professional consultation.
Focus on providing helpful, general information about potential pathways a user could explore with their dentist.
`,
});

const treatmentPlannerFlow = ai.defineFlow(
  {
    name: 'treatmentPlannerFlow',
    inputSchema: TreatmentPlannerInputSchema,
    outputSchema: TreatmentPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate treatment suggestions.');
    }
    // Ensure additionalInformation includes a strong disclaimer if the AI somehow misses it,
    // though the prompt is very specific.
    const disclaimer = "Remember, this information is for educational purposes only and is not a substitute for diagnosis or treatment by a qualified dental professional. Always consult your dentist for personalized advice and a treatment plan based on a clinical examination.";
    
    let finalAdditionalInfo = output.additionalInformation || "";
    if (!finalAdditionalInfo.includes("educational purposes only") && !finalAdditionalInfo.includes("substitute for diagnosis")) {
      finalAdditionalInfo = `${finalAdditionalInfo}\n\n${disclaimer}`.trim();
    }

    return {
        ...output,
        additionalInformation: finalAdditionalInfo
    };
  }
);

