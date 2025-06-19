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
import { assessOralHealth, type OralHealthAssessmentOutput } from '@/ai/flows/ai-oral-health-assessment';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  symptoms: z.string().min(5, { message: 'Describe symptoms in at least 5 characters, or type "None".' }),
  oralHygieneRoutine: z.string().min(10, { message: 'Describe routine in at least 10 characters.' }),
  diet: z.string().min(10, { message: 'Describe diet in at least 10 characters.' }),
  medicalConditions: z.string().min(5, { message: 'Describe medical conditions in at least 5 characters, or type "None".' }),
  medications: z.string().min(5, { message: 'List medications in at least 5 characters, or type "None".' }),
});

export default function OralHealthAssessmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OralHealthAssessmentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      oralHygieneRoutine: '',
      diet: '',
      medicalConditions: '',
      medications: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await assessOralHealth(values);
      setResult(response);
    } catch (error) {
      console.error('Oral Health Assessment Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get oral health assessment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Oral Health Assessment</CardTitle>
        <CardDescription>Provide details about your oral health for a preliminary AI-powered assessment. This tool is for informational purposes only.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="symptoms-oha-input">Symptoms (e.g., pain, sensitivity, bleeding)</FormLabel>
                  <FormControl>
                    <Textarea id="symptoms-oha-input" placeholder="e.g., Gums bleed when brushing, sensitive to hot/cold, or None" {...field} aria-describedby="symptoms-oha-message" />
                  </FormControl>
                  <FormMessage id="symptoms-oha-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oralHygieneRoutine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="oralHygieneRoutine-oha-input">Oral Hygiene Routine (brushing, flossing frequency)</FormLabel>
                  <FormControl>
                    <Textarea id="oralHygieneRoutine-oha-input" placeholder="e.g., Brush twice a day, floss once a day, use mouthwash" {...field} aria-describedby="oralHygieneRoutine-oha-message" />
                  </FormControl>
                  <FormMessage id="oralHygieneRoutine-oha-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="diet-oha-input">Diet (sugary food/drink consumption)</FormLabel>
                  <FormControl>
                    <Textarea id="diet-oha-input" placeholder="e.g., I often eat sweets and drink soda. I try to eat fruits and vegetables." {...field} aria-describedby="diet-oha-message" />
                  </FormControl>
                  <FormMessage id="diet-oha-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="medicalConditions-oha-input">Existing Medical Conditions (if any)</FormLabel>
                  <FormControl>
                    <Textarea id="medicalConditions-oha-input" placeholder="e.g., Diabetes, heart condition, or None" {...field} aria-describedby="medicalConditions-oha-message" />
                  </FormControl>
                  <FormMessage id="medicalConditions-oha-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="medications-oha-input">Current Medications (if any)</FormLabel>
                  <FormControl>
                    <Textarea id="medications-oha-input" placeholder="e.g., Aspirin, blood pressure medication, or None" {...field} aria-describedby="medications-oha-message" />
                  </FormControl>
                  <FormMessage id="medications-oha-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Oral Health Assessment
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Oral Health Assessment Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground/90">Summary:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Recommendations:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.recommendations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Identified Risk Factors:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.riskFactors}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Suggested Next Steps:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.nextSteps}</p>
              </div>
               <p className="text-sm text-destructive mt-4">
                <strong>Disclaimer:</strong> This AI assessment is not a diagnosis. Consult with a qualified dental professional for any health concerns or before making any decisions related to your health or treatment.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
