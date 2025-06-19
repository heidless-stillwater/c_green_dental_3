// src/ai/flows/ai-dental-insurance-helper.ts
'use server';
/**
 * @fileOverview Provides guidance on dental insurance coverage.
 *
 * - getDentalInsuranceGuidance - A function that provides guidance based on insurance details and procedure.
 * - DentalInsuranceHelperInput - The input type for the function.
 * - DentalInsuranceHelperOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DentalInsuranceHelperInputSchema = z.object({
  insuranceProvider: z.string().min(2, { message: 'Insurance provider name is required (e.g., Delta Dental, MetLife).' }).describe('The name of the dental insurance provider.'),
  planDetails: z.string().min(20, { message: 'Please provide some key details about your plan (at least 20 characters).' }).describe('Key details of the dental insurance plan (e.g., "PPO Plan X, covers 80% for major restorative after $50 deductible, annual max $1500").'),
  dentalProcedure: z.string().min(5, { message: 'Please describe the dental procedure (at least 5 characters).' }).describe('The dental procedure for which coverage information is sought (e.g., "Root canal on molar #19", "Wisdom tooth extraction", "Dental implant for front tooth").'),
  estimatedProcedureCost: z.coerce.number().optional().describe('Optional estimated cost of the dental procedure, if known by the user.'),
});
export type DentalInsuranceHelperInput = z.infer<typeof DentalInsuranceHelperInputSchema>;

const DentalInsuranceHelperOutputSchema = z.object({
  coverageGuidance: z.string().describe('Guidance on potential coverage based on the provided plan details and procedure. This should analyze how the described plan might apply to the procedure.'),
  estimatedOutOfPocket: z.string().describe('A general estimation of out-of-pocket expenses (e.g., deductible, co-payment, percentage not covered). This should clearly state it is an estimate.'),
  potentialLimitations: z.string().describe('Common limitations or considerations such as waiting periods, annual maximums, frequency limits, or if pre-authorization might be needed.'),
  nextStepsRecommendation: z.string().describe('Recommendations for the user, such as specific questions to ask their insurance provider or information to gather.'),
  disclaimer: z.string().describe('A disclaimer stating that this is AI-generated guidance, not a guarantee of coverage, and the user should always verify with their insurance provider.'),
});
export type DentalInsuranceHelperOutput = z.infer<typeof DentalInsuranceHelperOutputSchema>;

export async function getDentalInsuranceGuidance(input: DentalInsuranceHelperInput): Promise<DentalInsuranceHelperOutput> {
  return dentalInsuranceHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dentalInsuranceHelperPrompt',
  input: {schema: DentalInsuranceHelperInputSchema},
  output: {schema: DentalInsuranceHelperOutputSchema},
  prompt: `You are an AI assistant designed to help users understand potential dental insurance coverage for a specific procedure.
  Your goal is to provide helpful guidance based on the information they provide about their insurance plan and the dental procedure.
  You are NOT an insurance provider and CANNOT guarantee coverage.

  User's Insurance Provider: {{{insuranceProvider}}}
  User's Plan Details: {{{planDetails}}}
  Dental Procedure in Question: {{{dentalProcedure}}}
  {{#if estimatedProcedureCost}}
  User's Estimated Cost for Procedure: {{{estimatedProcedureCost}}}
  {{/if}}

  Based on this information, please provide the following:
  1.  **Coverage Guidance**: Analyze how the described plan details might apply to the dental procedure. Mention typical coverage patterns if plan details are vague but caution that specifics vary.
  2.  **Estimated Out-of-Pocket**: Give a general idea of potential out-of-pocket costs (deductibles, copayments, coinsurance). If an estimated procedure cost is provided, try to use it in your estimation. Explicitly state this is an estimate.
  3.  **Potential Limitations**: Highlight common insurance limitations like annual maximums, waiting periods, frequency limits, or the need for pre-authorization, especially as they might relate to the described procedure.
  4.  **Next Steps Recommendation**: Suggest what the user should do next, e.g., questions to ask their insurance company, specific codes to inquire about (if applicable and generally known for the procedure), or the importance of a pre-treatment estimate.
  5.  **Disclaimer**: Crucially, include a disclaimer: "This information is AI-generated guidance based on the details you provided and general knowledge of dental insurance. It is NOT a guarantee of coverage. Please verify all details, coverage, and costs directly with your insurance provider before proceeding with any treatment."

  Structure your response according to the output schema. Be clear, concise, and empathetic. Avoid making definitive statements about coverage.`,
});

const dentalInsuranceHelperFlow = ai.defineFlow(
  {
    name: 'dentalInsuranceHelperFlow',
    inputSchema: DentalInsuranceHelperInputSchema,
    outputSchema: DentalInsuranceHelperOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a response for the insurance guidance.');
    }
    // Ensure a default disclaimer if the AI somehow misses it, though the prompt is specific.
    return {
      ...output,
      disclaimer: output.disclaimer || "This information is AI-generated guidance based on the details you provided and general knowledge of dental insurance. It is NOT a guarantee of coverage. Please verify all details, coverage, and costs directly with your insurance provider before proceeding with any treatment."
    };
  }
);
