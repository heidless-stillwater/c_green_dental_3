'use server';
/**
 * @fileOverview Provides AI-powered patient education on dental health topics.
 *
 * - getPatientEducationInfo - A function that retrieves educational content on a given dental topic.
 * - PatientEducationInput - The input type for the function.
 * - PatientEducationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientEducationInputSchema = z.object({
  topic: z.string().min(3, {message: "Please enter a dental topic (at least 3 characters)."}).describe('The dental health topic the user wants to learn about (e.g., "gum disease", "how to floss properly", "effects of sugar on teeth").'),
});
export type PatientEducationInput = z.infer<typeof PatientEducationInputSchema>;

const PatientEducationOutputSchema = z.object({
  topicTitle: z.string().describe('The confirmed or refined title of the dental health topic.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  sections: z.array(z.object({
    title: z.string().describe('The title of this section (e.g., Causes, Symptoms, Prevention).'),
    content: z.string().describe('The detailed content for this section.'),
  })).min(1, { message: "At least one educational section should be provided." }).describe('An array of sections breaking down the topic.'),
  keyTakeaways: z.string().optional().describe('A few key takeaway points, if applicable.'),
  disclaimer: z.string().describe('A disclaimer stating this is for educational purposes only and not a substitute for professional dental advice.')
});
export type PatientEducationOutput = z.infer<typeof PatientEducationOutputSchema>;

export async function getPatientEducationInfo(input: PatientEducationInput): Promise<PatientEducationOutput> {
  return patientEducationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'patientEducationPrompt',
  input: {schema: PatientEducationInputSchema},
  output: {schema: PatientEducationOutputSchema},
  prompt: `You are an AI Dental Health Educator. Your goal is to provide clear, accurate, and easy-to-understand information on various dental health topics.
The user wants to learn about: {{{topic}}}

Please provide information structured as follows:
1.  **Topic Title**: Confirm or refine the topic title based on the user's input.
2.  **Introduction**: A brief overview of the topic.
3.  **Sections**: Break down the topic into logical sections (e.g., What is it?, Causes, Symptoms, Prevention, Treatment Options, Self-Care Tips). Each section should have a clear \`title\` and detailed \`content\`. Aim for 2-5 informative sections.
4.  **Key Takeaways** (Optional but Recommended): Summarize 2-3 main points if applicable.
5.  **Disclaimer**: Include this exact disclaimer: "This information is for educational purposes only and should not be considered a substitute for diagnosis or treatment by a qualified dental professional. Always consult with your dentist or other qualified healthcare provider with any questions you may have regarding a medical condition or dental health."

Structure your response according to the output schema. Ensure the information is reliable and presented in an accessible manner for a general audience. Avoid overly technical jargon where possible, or explain it if necessary.
`,
});

const patientEducationFlow = ai.defineFlow(
  {
    name: 'patientEducationFlow',
    inputSchema: PatientEducationInputSchema,
    outputSchema: PatientEducationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate patient education content.');
    }
    // Ensure the disclaimer is always present and correct, and that sections exist.
    return {
      ...output,
      sections: output.sections && output.sections.length > 0 ? output.sections : [{ title: "Information", content: "No detailed sections were generated for this topic." }],
      disclaimer: output.disclaimer || "This information is for educational purposes only and should not be considered a substitute for diagnosis or treatment by a qualified dental professional. Always consult with your dentist or other qualified healthcare provider with any questions you may have regarding a medical condition or dental health."
    };
  }
);
