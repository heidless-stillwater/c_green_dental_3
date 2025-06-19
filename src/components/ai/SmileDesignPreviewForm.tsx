// src/components/ai/SmileDesignPreviewForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { aiSmileDesignPreview, type AISmileDesignPreviewOutput } from '@/ai/flows/ai-smile-design-preview';
import { Loader2, Sparkles } from 'lucide-react';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  userPhoto: z
    .instanceof(File, { message: 'A photo of your smile is required.' })
    .refine((file) => file.size <= MAX_FILE_SIZE_BYTES, `Max file size is ${MAX_FILE_SIZE_MB}MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, .webp formats are supported."
    ),
  desiredSmileDescription: z.string().min(10, { message: 'Describe your desired smile in at least 10 characters (e.g., "whiter teeth", "straighter teeth", "close gap").' }),
});

export default function SmileDesignPreviewForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AISmileDesignPreviewOutput | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPhoto: undefined,
      desiredSmileDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const userPhotoDataUri = reader.result as string;
      try {
        const response = await aiSmileDesignPreview({
          userPhotoDataUri,
          desiredSmileDescription: values.desiredSmileDescription,
        });
        setResult(response);
      } catch (error: any) {
        console.error('Smile Design Preview Error:', error);
        toast({
          variant: 'destructive',
          title: 'Error Generating Preview',
          description: error.message || 'Failed to generate smile preview. The image might be unsuitable or the description too complex. Please try a different image or simplify your request.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'Could not read the uploaded file. Please try again.',
      });
      setIsLoading(false);
    }
    reader.readAsDataURL(values.userPhoto);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="h-6 w-6 text-primary" /> AI Smile Design Preview</CardTitle>
        <CardDescription>Upload a clear, front-facing photo of your smile and describe the changes you'd like to see. Our AI will generate a virtual preview. For best results, use a well-lit photo focusing on your smile.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="userPhoto"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel htmlFor="userPhoto-input">Upload Your Photo (Max {MAX_FILE_SIZE_MB}MB)</FormLabel>
                  <FormControl>
                    <Input
                      id="userPhoto-input"
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file); // Update react-hook-form
                          const previewReader = new FileReader();
                          previewReader.onloadend = () => {
                            setUserImagePreview(previewReader.result as string);
                          };
                          previewReader.readAsDataURL(file);
                        } else {
                          onChange(undefined);
                          setUserImagePreview(null);
                        }
                      }}
                      {...rest}
                      aria-describedby="userPhoto-message"
                    />
                  </FormControl>
                  <FormMessage id="userPhoto-message" />
                </FormItem>
              )}
            />

            {userImagePreview && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground/80 mb-2">Your Current Photo:</h4>
                <div className="border rounded-md p-2 bg-muted/20 inline-block">
                  <Image src={userImagePreview} alt="User upload preview" width={300} height={300} className="rounded-md object-contain max-h-72" />
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="desiredSmileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="desiredSmileDescription-input">Describe Desired Smile Changes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="desiredSmileDescription-input"
                      placeholder="e.g., Make my teeth whiter and straighter, close the small gap between my front teeth."
                      rows={3}
                      {...field}
                      aria-describedby="desiredSmileDescription-message"
                    />
                  </FormControl>
                  <FormMessage id="desiredSmileDescription-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Preview...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Get Smile Preview
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>

      {result && (
        <CardContent className="mt-6">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-lg">AI Generated Smile Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.previewImageDataUri ? (
                <div>
                  <h4 className="text-sm font-medium text-foreground/80 mb-2">Preview Image:</h4>
                   <div className="border rounded-md p-2 bg-background inline-block shadow">
                    <Image src={result.previewImageDataUri} alt="AI Smile Preview" width={400} height={400} className="rounded-md object-contain max-h-[450px]" />
                  </div>
                </div>
              ) : (
                <p className="text-destructive">Preview image could not be generated.</p>
              )}
              <div>
                <h4 className="text-sm font-medium text-foreground/80 mb-1">Design Notes:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap text-sm">{result.designNotes}</p>
              </div>
              <p className="text-xs text-destructive mt-4 pt-2 border-t border-border">
                <strong>Important Disclaimer:</strong> This AI-generated smile preview is for illustrative purposes only and does not represent a guaranteed outcome of any dental treatment. Actual results may vary. Consult with a qualified dental professional for accurate assessment and personalized treatment planning.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
