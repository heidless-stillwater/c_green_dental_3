
// src/components/ai/PostTreatmentCareGuideForm.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getPostTreatmentCareGuide, type PostTreatmentCareOutput } from '@/ai/flows/ai-post-treatment-care-guide';
import { Loader2, BookHeart } from 'lucide-react';

const formSchema = z.object({
  dentalProcedurePerformed: z.string().min(5, { message: "Please describe the dental procedure performed (at least 5 characters). Examples: 'wisdom tooth extraction', 'dental implant placement'." }),
  patientSpecifics: z.string().optional(),
});

export default function PostTreatmentCareGuideForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PostTreatmentCareOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dentalProcedurePerformed: '',
      patientSpecifics: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getPostTreatmentCareGuide(values);
      setResult(response);
    } catch (error: any) {
      console.error('Post-Treatment Care Guide Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Getting Care Guide',
        description: error.message || 'Failed to generate post-treatment care advice. Please check your input and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BookHeart className="h-6 w-6 text-primary" /> AI Post-Treatment Care Guide
        </CardTitle>
        <CardDescription>
          Enter the dental procedure performed and any relevant patient details to receive general post-treatment care instructions.
          This guide provides general information and is not a substitute for advice from your treating dentist.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dentalProcedurePerformed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dentalProcedurePerformed-input">Dental Procedure Performed</FormLabel>
                  <FormControl>
                    <Textarea
                      id="dentalProcedurePerformed-input"
                      placeholder="e.g., Wisdom tooth extraction (lower right), Routine dental cleaning, Crown placement on tooth #5"
                      rows={2}
                      {...field}
                      aria-describedby="dentalProcedurePerformed-message"
                    />
                  </FormControl>
                  <FormMessage id="dentalProcedurePerformed-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientSpecifics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="patientSpecifics-input">Patient Specifics (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="patientSpecifics-input"
                      placeholder="e.g., Patient is a smoker, Allergic to penicillin, Diabetic, Procedure was complex."
                      rows={3}
                      {...field}
                      aria-describedby="patientSpecifics-message"
                    />
                  </FormControl>
                  <FormMessage id="patientSpecifics-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Guide...
                </>
              ) : (
                <>
                  <BookHeart className="mr-2 h-4 w-4" /> Get Care Guide
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
              <CardTitle className="font-headline text-lg">Post-Treatment Care Advice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground/90">General Instructions:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.generalInstructions}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Pain Management:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.painManagement}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Swelling and Bruising:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.swellingAndBruising}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Bleeding Control:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.bleedingControl}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Expected Symptoms:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.expectedSymptoms}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90 text-amber-600 dark:text-amber-400">When to Call Your Dentist:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.whenToCallDentist}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Follow-Up Appointment:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.followUpAppointment}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-border">
                <h4 className="font-semibold text-destructive">Important Disclaimer:</h4>
                <p className="text-sm text-destructive whitespace-pre-wrap">{result.disclaimer}</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}

