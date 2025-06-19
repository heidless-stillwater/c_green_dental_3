
'use server';
/**
 * @fileOverview Provides AI-powered dental treatment cost estimations.
 *
 * - getTreatmentCostEstimate - A function that estimates treatment costs.
 * - TreatmentCostCalculatorInput - The input type for the function.
 * - TreatmentCostCalculatorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TreatmentCostCalculatorInputSchema = z.object({
  procedureDescription: z.string().min(5, { message: "Please describe the dental procedure (at least 5 characters)." }).describe('A description of the dental procedure for which a cost estimate is sought (e.g., "Routine dental cleaning and exam", "Root canal on a molar", "Single dental implant for a front tooth").'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Please enter a valid 5-digit or 9-digit ZIP code (e.g., 90210 or 90210-1234)."}).optional().describe('The user\'s 5-digit or 9-digit ZIP code to help gauge regional cost variations. (e.g., 90210)'),
  insuranceInfo: z.string().optional().describe('Brief description of the user\'s dental insurance, if any (e.g., "No insurance", "Delta Dental PPO, $50 deductible, 80% coverage for preventive", "MetLife, unsure about coverage details").'),
});
export type TreatmentCostCalculatorInput = z.infer<typeof TreatmentCostCalculatorInputSchema>;

const TreatmentCostCalculatorOutputSchema = z.object({
  estimatedCostRange: z.string().describe('A very general estimated cost range for the described procedure. This should clearly state it is a broad estimate and can vary significantly.'),
  factorsInfluencingCost: z.string().describe('A list of common factors that can influence the actual cost of the dental procedure (e.g., geographic location, complexity of the case, materials used, dentist\'s experience, specific clinic fees).'),
  insuranceConsiderations: z.string().describe('General advice on how dental insurance might affect the cost, if insurance information was provided. This should mention concepts like deductibles, co-pays, annual maximums, and in-network vs. out-of-network providers.'),
  disclaimer: z.string().describe('A mandatory disclaimer stating that this is an AI-generated estimate, not a quote, and users must consult their dental provider for accurate costs.'),
});
export type TreatmentCostCalculatorOutput = z.infer<typeof TreatmentCostCalculatorOutputSchema>;

export async function getTreatmentCostEstimate(input: TreatmentCostCalculatorInput): Promise<TreatmentCostCalculatorOutput> {
  return treatmentCostCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'treatmentCostCalculatorPrompt',
  input: {schema: TreatmentCostCalculatorInputSchema},
  output: {schema: TreatmentCostCalculatorOutputSchema},
  prompt: `You are an AI assistant helping users understand POTENTIAL cost ranges for dental procedures.
  You CANNOT provide exact quotes. Your estimates must be very general and clearly labeled as such.

  User's request:
  Procedure: {{{procedureDescription}}}
  {{#if zipCode}}ZIP Code: {{{zipCode}}}{{/if}}
  {{#if insuranceInfo}}Insurance Information: {{{insuranceInfo}}}{{/if}}

  Based on this, provide the following:

  1.  **Estimated Cost Range**:
      *   Offer a VERY broad, general estimated cost range for the described procedure in a typical US setting. For example, "A routine dental cleaning and exam can typically range from $X to $Y."
      *   If the procedure is too vague or complex for a general estimate, state that clearly (e.g., "It's difficult to provide a general cost range for '[procedure]' without more specific details from a dentist.").
      *   ALWAYS preface with a statement like: "Based on general information, the estimated cost range for..."
      *   ALWAYS follow with: "This is a very broad estimate and actual costs can vary significantly."

  2.  **Factors Influencing Cost**:
      *   List several key factors that influence the final cost of dental treatments. Examples: dentist's experience and specialty, geographic location (costs vary between urban/rural and different states), complexity of the individual's case, materials used (e.g., type of crown or implant), specific clinic fees, and whether anesthesia or sedation is needed.

  3.  **Insurance Considerations**:
      *   If insurance information is provided ({{{insuranceInfo}}}), offer general advice. Discuss concepts like:
          *   Deductibles: "Your plan might have a deductible you need to meet before coverage kicks in."
          *   Co-payments/Co-insurance: "You may be responsible for a co-payment or a percentage of the cost (co-insurance)."
          *   Annual Maximums: "Most dental plans have an annual maximum benefit limit."
          *   In-network vs. Out-of-network: "Costs are usually lower if you see an in-network provider."
          *   Waiting Periods: "Some plans have waiting periods for certain procedures."
          *   Pre-authorization: "Major procedures might require pre-authorization from your insurer."
      *   If no insurance information is provided, you can say: "If you have dental insurance, it could significantly reduce your out-of-pocket expenses. It's best to check your plan details."
      *   Always recommend contacting the insurance provider for specifics.

  4.  **Disclaimer** (MANDATORY - use this exact text):
      "IMPORTANT: This is an AI-generated estimate based on general information and the details you provided. It is NOT a quote or a guarantee of cost. Actual dental treatment costs can vary significantly based on many factors. Please consult directly with your dental provider and, if applicable, your insurance company for an accurate treatment plan and precise cost estimate before proceeding with any treatment."

  Structure your response according to the output schema. Be helpful but cautious, always emphasizing the estimated nature of the information. Do not invent specific dollar amounts if you don't have a reasonable basis for a very broad range.
  If the ZIP code is provided, you can mention that costs vary by region, but do not attempt to give ZIP-code specific pricing.
  `,
});

const treatmentCostCalculatorFlow = ai.defineFlow(
  {
    name: 'treatmentCostCalculatorFlow',
    inputSchema: TreatmentCostCalculatorInputSchema,
    outputSchema: TreatmentCostCalculatorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate a treatment cost estimation.');
    }
    // Ensure the disclaimer is always present and correct
    return {
      ...output,
      disclaimer: output.disclaimer || "IMPORTANT: This is an AI-generated estimate based on general information and the details you provided. It is NOT a quote or a guarantee of cost. Actual dental treatment costs can vary significantly based on many factors. Please consult directly with your dental provider and, if applicable, your insurance company for an accurate treatment plan and precise cost estimate before proceeding with any treatment."
    };
  }
);

