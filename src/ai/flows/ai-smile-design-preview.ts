// src/ai/flows/ai-smile-design-preview.ts
'use server';
/**
 * @fileOverview Provides an AI-powered smile design preview.
 *
 * - aiSmileDesignPreview - A function that generates a virtual smile makeover.
 * - AISmileDesignPreviewInput - The input type for the function.
 * - AISmileDesignPreviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISmileDesignPreviewInputSchema = z.object({
  userPhotoDataUri: z
    .string()
    .describe(
      "The user's current photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  desiredSmileDescription: z.string().describe('A description of the desired smile changes (e.g., "whiter teeth", "straighter teeth", "close gap between front teeth").'),
});
export type AISmileDesignPreviewInput = z.infer<typeof AISmileDesignPreviewInputSchema>;

const AISmileDesignPreviewOutputSchema = z.object({
  previewImageDataUri: z
    .string()
    .describe(
      "The generated preview image of the smile makeover, as a data URI."
    ),
  designNotes: z.string().describe('Notes or comments about the generated smile design.'),
});
export type AISmileDesignPreviewOutput = z.infer<typeof AISmileDesignPreviewOutputSchema>;

export async function aiSmileDesignPreview(input: AISmileDesignPreviewInput): Promise<AISmileDesignPreviewOutput> {
  return aiSmileDesignPreviewFlow(input);
}

const aiSmileDesignPreviewFlow = ai.defineFlow(
  {
    name: 'aiSmileDesignPreviewFlow',
    inputSchema: AISmileDesignPreviewInputSchema,
    outputSchema: AISmileDesignPreviewOutputSchema,
  },
  async (input) => {
    const { userPhotoDataUri, desiredSmileDescription } = input;

    const generationResult = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // MUST use this model for image generation
      prompt: [
        { media: { url: userPhotoDataUri } },
        { text: `You are a virtual smile design assistant. Based on the provided photo and the desired smile description: "${desiredSmileDescription}", generate an image that previews these smile changes on the person in the photo. Focus on realistic and aesthetically pleasing modifications. Also, provide brief design notes related to the changes shown in the image, explaining what was modified.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
        safetySettings: [ // Adjusted safety settings to be less restrictive for image modification tasks
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      },
    });

    const previewImageDataUri = generationResult.media?.url;
    const designNotes = generationResult.text ?? "No specific design notes were generated. The image shows the requested preview.";

    if (!previewImageDataUri) {
      throw new Error('Image generation failed or did not return an image. The AI might have been unable to process the request due to content policies or other limitations.');
    }

    return {
      previewImageDataUri,
      designNotes,
    };
  }
);
