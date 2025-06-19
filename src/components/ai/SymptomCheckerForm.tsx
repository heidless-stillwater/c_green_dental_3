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
import { aiSymptomChecker, type AiSymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  symptoms: z.string().min(10, { message: 'Please describe your symptoms in at least 10 characters.' }),
});

export default function SymptomCheckerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiSymptomCheckerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiSymptomChecker(values);
      setResult(response);
    } catch (error) {
      console.error('Symptom Checker Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get assessment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Symptom Checker</CardTitle>
        <CardDescription>Describe your dental symptoms to get a preliminary assessment and urgency recommendation. This tool does not replace professional dental advice.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="symptoms-input">Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea
                      id="symptoms-input"
                      placeholder="e.g., Sharp pain in my lower left tooth when I drink something cold, started 2 days ago..."
                      rows={5}
                      {...field}
                      aria-describedby="symptoms-message"
                    />
                  </FormControl>
                  <FormMessage id="symptoms-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Assessment
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Assessment Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground/90">Preliminary Assessment:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.assessment}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Urgency:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.urgency}</p>
              </div>
              <p className="text-sm text-destructive">
                <strong>Disclaimer:</strong> This is an AI-generated assessment and not a substitute for professional medical advice. Please consult a dentist for an accurate diagnosis and treatment plan.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
