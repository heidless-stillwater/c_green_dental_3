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
import { aiEmergencyDentalAdvisor, type AIEmergencyDentalAdvisorOutput } from '@/ai/flows/ai-emergency-dental-advisor';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  emergencyDescription: z.string().min(15, { message: 'Describe your emergency in at least 15 characters.' }),
});

export default function EmergencyDentalAdvisorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIEmergencyDentalAdvisorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emergencyDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await aiEmergencyDentalAdvisor(values);
      setResult(response);
    } catch (error) {
      console.error('Emergency Dental Advisor Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get emergency advice. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Emergency Dental Advisor</CardTitle>
        <CardDescription>Describe your dental emergency for immediate guidance. This advice is not a substitute for professional dental care. Seek professional help as soon as possible.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emergencyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="emergencyDescription-input">Describe Your Dental Emergency</FormLabel>
                  <FormControl>
                    <Textarea
                      id="emergencyDescription-input"
                      placeholder="e.g., I knocked out a tooth playing sports. It's bleeding a lot..."
                      rows={5}
                      {...field}
                      aria-describedby="emergencyDescription-message"
                    />
                  </FormControl>
                  <FormMessage id="emergencyDescription-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} variant="destructive" className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Emergency Advice
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <Card className="mt-6 border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="font-headline text-lg text-destructive">Emergency Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-destructive/90">Immediate Steps:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.immediateGuidance}</p>
              </div>
              <div>
                <h4 className="font-semibold text-destructive/90">Important Disclaimer:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.disclaimer}</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
