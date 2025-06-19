
'use server';
/**
 * @fileOverview Provides an AI-powered assistant to help users formulate appointment requests.
 *
 * - assistWithAppointment - A function that parses a user's appointment request and guides them on next steps.
 * - AiAppointmentRequestInput - The input type for the function.
 * - AiAppointmentRequestOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CONTACT_DETAILS } from '@/lib/constants';

const AiAppointmentRequestInputSchema = z.object({
  userRequest: z.string().min(10, { message: "Please describe your appointment request in at least 10 characters." }).describe("User's natural language request for an appointment (e.g., 'I need a cleaning next week', 'Can I book a check-up for Tuesday morning?')."),
});
export type AiAppointmentRequestInput = z.infer<typeof AiAppointmentRequestInputSchema>;

const AiAppointmentRequestOutputSchema = z.object({
  confirmationMessage: z.string().describe("A friendly message acknowledging the user's request."),
  parsedService: z.string().describe("The dental service the AI understood the user is requesting (e.g., 'dental cleaning', 'check-up', 'consultation for braces'). If not clear, it might state 'General Consultation' or similar."),
  parsedDateTime: z.string().describe("Any date or time preferences the AI understood from the user's request (e.g., 'next Tuesday afternoon', 'weekday mornings', 'ASAP'). If not clear, it might state 'Flexible' or 'To be discussed'."),
  suggestedNextSteps: z.string().describe("Clear, actionable next steps for the user to actually book the appointment, guiding them to call or use the contact page."),
  disclaimer: z.string().describe("A disclaimer stating that this AI tool helps formulate requests but does not directly book appointments, and final confirmation is needed from clinic staff."),
});
export type AiAppointmentRequestOutput = z.infer<typeof AiAppointmentRequestOutputSchema>;

export async function assistWithAppointment(input: AiAppointmentRequestInput): Promise<AiAppointmentRequestOutput> {
  return aiAppointmentSchedulerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAppointmentSchedulerPrompt',
  input: {schema: AiAppointmentRequestInputSchema},
  output: {schema: AiAppointmentRequestOutputSchema},
  prompt: `You are an AI Appointment Assistant for 'The Green Dental Surgery'.
Your primary goal is to understand a user's request for a dental appointment and then clearly guide them on how to officially book it using the clinic's existing methods.
You DO NOT book appointments directly into any system. You help them formulate their request and tell them how to contact the clinic.

User's request: {{{userRequest}}}

Based on this request, please provide the following:

1.  **Confirmation Message**: Start with a friendly and helpful acknowledgment (e.g., "I can help with your appointment request!" or "Okay, let's get your appointment request started.").
2.  **Parsed Service (parsedService)**: Identify the dental service the user is likely requesting.
    *   If a specific service like "cleaning", "check-up", "whitening", "braces consultation", "root canal inquiry", "wisdom tooth problem" is mentioned, use that.
    *   If the user is vague (e.g., "I need an appointment," "I have a toothache," "Something is wrong with my tooth"), infer a general service like "General Consultation," "Dental Check-up," or "Problem Assessment."
    *   If completely unclear, state "Service to be discussed."
3.  **Parsed Date/Time (parsedDateTime)**: Identify any date or time preferences mentioned by the user.
    *   Examples: "next Tuesday afternoon", "weekday mornings", "ASAP", "end of July".
    *   If no specific date or time is mentioned, set this to "Flexible" or "To be discussed with our team".
4.  **Suggested Next Steps (suggestedNextSteps)**: Provide clear, step-by-step instructions on how the user should proceed to make a booking.
    *   This message MUST guide them to contact the clinic directly.
    *   Example format: "To schedule your [parsedService], please call our office at [PHONE_NUMBER_PLACEHOLDER] or visit our 'Contact Us' page on our website to send a booking request. Our team will then work with you to find a suitable time for your [parsedService], considering your preferences for [parsedDateTime]."
    *   (The actual phone number will be inserted by the system later, so use the placeholder \`[PHONE_NUMBER_PLACEHOLDER]\`).
5.  **Disclaimer (disclaimer)**: Include this exact disclaimer: "Please note: This AI tool helps gather your appointment preferences but does not book appointments directly into our system. Final confirmation of your appointment will come from our staff after you contact us using the methods above."

Ensure your tone is professional, friendly, and helpful. Focus on making the next steps clear for the user.
`,
});

const aiAppointmentSchedulerFlow = ai.defineFlow(
  {
    name: 'aiAppointmentSchedulerFlow',
    inputSchema: AiAppointmentRequestInputSchema,
    outputSchema: AiAppointmentRequestOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI failed to generate appointment assistance.');
    }

    // Replace placeholder with actual phone number
    const finalSuggestedNextSteps = output.suggestedNextSteps.replace('[PHONE_NUMBER_PLACEHOLDER]', CONTACT_DETAILS.phone);

    return {
      ...output,
      suggestedNextSteps: finalSuggestedNextSteps,
      disclaimer: output.disclaimer || "Please note: This AI tool helps gather your appointment preferences but does not book appointments directly into our system. Final confirmation of your appointment will come from our staff after you contact us."
    };
  }
);

