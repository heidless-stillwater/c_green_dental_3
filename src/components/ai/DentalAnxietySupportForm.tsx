
// src/components/ai/DentalAnxietySupportForm.tsx
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
import { getDentalAnxietySupport, type DentalAnxietySupportOutput } from '@/ai/flows/ai-dental-anxiety-support';
import { Loader2, HeartHandshake } from 'lucide-react';

const formSchema = z.object({
  anxietyDescription: z.string().min(10, { message: "Please describe what makes you anxious about dental visits (at least 10 characters)." }),
});

export default function DentalAnxietySupportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DentalAnxietySupportOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anxietyDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getDentalAnxietySupport(values);
      setResult(response);
    } catch (error: any) {
      console.error('Dental Anxiety Support Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Getting Support',
        description: error.message || 'Failed to generate anxiety support advice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-primary" /> AI Dental Anxiety Support
        </CardTitle>
        <CardDescription>
          Share your feelings or triggers related to dental visits, and our AI will offer some coping strategies and relaxation techniques. This tool is for support and does not replace professional advice.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="anxietyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="anxietyDescription-input">Describe Your Dental Anxiety</FormLabel>
                  <FormControl>
                    <Textarea
                      id="anxietyDescription-input"
                      placeholder="e.g., I'm scared of needles and the sound of the drill. I get very tense in the dental chair."
                      rows={4}
                      {...field}
                      aria-describedby="anxietyDescription-message"
                    />
                  </FormControl>
                  <FormMessage id="anxietyDescription-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Support...
                </>
              ) : (
                <>
                  <HeartHandshake className="mr-2 h-4 w-4" /> Get Coping Strategies
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
              <CardTitle className="font-headline text-lg">Your Dental Anxiety Support Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground/90">Coping Strategies:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.copingStrategies}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Relaxation Techniques:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.relaxationTechniques}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Positive Affirmations:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.positiveAffirmations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Communication Tips:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.communicationTips}</p>
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
