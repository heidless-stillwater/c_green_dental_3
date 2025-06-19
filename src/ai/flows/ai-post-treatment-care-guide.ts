
// src/ai/flows/ai-post-treatment-care-guide.ts
'use server';
/**
 * @fileOverview Provides AI-generated post-treatment care guidance.
 *
 * - getPostTreatmentCareGuide - A function that generates care instructions after a dental procedure.
 * - PostTreatmentCareInput - The input type for the function.
 * - PostTreatmentCareOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PostTreatmentCareInputSchema = z.object({
  dentalProcedurePerformed: z.string().min(5, { message: "Please describe the dental procedure performed (at least 5 characters). Examples: 'wisdom tooth extraction', 'dental implant placement', 'root canal therapy', 'deep cleaning'." }).describe('The dental procedure that was performed.'),
  patientSpecifics: z.string().optional().describe("Optional: Any patient-specific details relevant to recovery (e.g., '65-year-old male, non-smoker, history of slow healing', 'patient is allergic to codeine', 'procedure was on upper right side')."),
});
export type PostTreatmentCareInput = z.infer<typeof PostTreatmentCareInputSchema>;

const PostTreatmentCareOutputSchema = z.object({
  generalInstructions: z.string().describe("General post-operative instructions for care, covering aspects like diet (soft foods, avoid straws if applicable), oral hygiene (gentle rinsing, when to resume brushing/flossing near area), and activity restrictions (rest, avoid strenuous activity)."),
  painManagement: z.string().describe("Advice on managing pain and discomfort. This may include suggestions for over-the-counter pain relievers (e.g., ibuprofen, acetaminophen, if generally appropriate), application of cold packs, and when pain should typically subside or if increasing pain is a concern."),
  swellingAndBruising: z.string().describe("Information on managing swelling and bruising, if common for the procedure (e.g., use of ice packs, how long it might last). If not typically expected, state that."),
  bleedingControl: z.string().describe("Instructions for controlling any minor bleeding, if expected (e.g., biting on gauze). Specify what is considered normal vs. excessive bleeding that requires attention."),
  expectedSymptoms: z.string().describe("Common symptoms to expect during recovery (e.g., mild soreness, temporary sensitivity, slight oozing) and their typical duration. Differentiate from warning signs."),
  whenToCallDentist: z.string().describe("Specific warning signs or symptoms that warrant contacting the dentist immediately (e.g., severe or worsening pain not relieved by medication, uncontrolled bleeding, high fever, pus or foul taste/odor, adverse reaction to medication)."),
  followUpAppointment: z.string().describe("General advice about the importance of follow-up appointments, and if one is typically required for the described procedure (e.g., 'Your dentist will advise if a follow-up is needed for suture removal or to check healing.')."),
  disclaimer: z.string().describe("A clear disclaimer stating this is AI-generated general advice and not a substitute for direct instructions from their dentist who performed the procedure."),
});
export type PostTreatmentCareOutput = z.infer<typeof PostTreatmentCareOutputSchema>;

export async function getPostTreatmentCareGuide(input: PostTreatmentCareInput): Promise<PostTreatmentCareOutput> {
  return postTreatmentCareFlow(input);
}

const prompt = ai.definePrompt({
  name: 'postTreatmentCarePrompt',
  input: {schema: PostTreatmentCareInputSchema},
  output: {schema: PostTreatmentCareOutputSchema},
  prompt: `You are an AI assistant providing post-treatment care guidance for dental procedures.
  Your goal is to offer general, helpful, and safe aftercare instructions.
  You are NOT the treating dentist and CANNOT provide specific medical advice tailored to an individual's unique situation or the exact way the procedure was performed. Your advice must be general.

  Dental Procedure Performed: {{{dentalProcedurePerformed}}}
  {{#if patientSpecifics}}
  Patient-Specific Considerations (use for context, but keep advice general): {{{patientSpecifics}}}
  {{/if}}

  Based on this information, please provide the following in a clear, easy-to-understand, and empathetic tone:

  1.  **General Instructions**: What are typical things the patient should do or avoid (diet, oral hygiene, activity levels)? Be specific based on common knowledge for the procedure type.
  2.  **Pain Management**: General advice for managing discomfort (e.g., over-the-counter options if commonly recommended like ibuprofen or acetaminophen, when to be concerned about pain). Do not prescribe specific dosages.
  3.  **Swelling and Bruising**: How to manage swelling or bruising if it's common for this procedure. If not, state that.
  4.  **Bleeding Control**: What to do for minor bleeding, if expected for this procedure. Specify what is normal vs. excessive.
  5.  **Expected Symptoms**: What are common, normal symptoms during recovery (e.g., mild soreness, temporary sensitivity) and their usual timeline?
  6.  **When to Call the Dentist**: Clear warning signs or symptoms that mean the patient should contact their dentist or seek urgent care (e.g., severe pain not relieved by medication, excessive bleeding, signs of infection like fever or pus, allergic reaction).
  7.  **Follow-up Appointment**: General information about whether a follow-up is usually needed and its purpose.
  8.  **Disclaimer**: Include this exact disclaimer: "This is general AI-generated advice for post-treatment care. It is NOT a substitute for the specific instructions provided by your dentist or oral surgeon who performed the procedure. Always follow their personalized guidance. If you have any concerns or urgent issues, contact your dental office immediately."

  Structure your response according to the output schema. Prioritize safety. If unsure about a specific detail for the procedure, provide general advice or state that specific instructions should come from the treating dentist.
  For example, if the procedure is 'teeth whitening', bleeding control or swelling sections might state 'Not typically expected for this procedure.'
  If the procedure is 'wisdom tooth extraction', detailed advice for all sections would be appropriate.
  If patient specifics mention 'allergic to ibuprofen', your pain management advice should reflect that by suggesting alternatives like acetaminophen, without being overly prescriptive.
  `,
});

const postTreatmentCareFlow = ai.defineFlow(
  {
    name: 'postTreatmentCareFlow',
    inputSchema: PostTreatmentCareInputSchema,
    outputSchema: PostTreatmentCareOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate post-treatment care guidance.');
    }
    // Ensure the disclaimer is always present
    return {
      ...output,
      disclaimer: output.disclaimer || "This is general AI-generated advice for post-treatment care. It is NOT a substitute for the specific instructions provided by your dentist or oral surgeon who performed the procedure. Always follow their personalized guidance. If you have any concerns or urgent issues, contact your dental office immediately."
    };
  }
);

