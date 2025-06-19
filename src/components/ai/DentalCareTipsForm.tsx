"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getDentalCareTips, type DentalCareTipsOutput } from '@/ai/flows/ai-dental-care-tips';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  age: z.coerce.number().min(1, { message: 'Please enter a valid age.' }).max(120),
  dietaryHabits: z.string().min(10, { message: 'Describe dietary habits in at least 10 characters.' }),
  oralHygieneRoutine: z.string().min(10, { message: 'Describe oral hygiene routine in at least 10 characters.' }),
  dentalHistory: z.string().min(10, { message: 'Describe dental history in at least 10 characters.' }),
});

export default function DentalCareTipsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DentalCareTipsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: undefined,
      dietaryHabits: '',
      oralHygieneRoutine: '',
      dentalHistory: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getDentalCareTips(values);
      setResult(response);
    } catch (error) {
      console.error('Dental Care Tips Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get dental care tips. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Dental Care Tips</CardTitle>
        <CardDescription>Get personalized oral hygiene recommendations based on your information. This is not a substitute for advice from your dentist.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="age-input">Age</FormLabel>
                  <FormControl>
                    <Input id="age-input" type="number" placeholder="Your age" {...field} aria-describedby="age-message" />
                  </FormControl>
                  <FormMessage id="age-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryHabits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dietaryHabits-input">Dietary Habits</FormLabel>
                  <FormControl>
                    <Textarea id="dietaryHabits-input" placeholder="e.g., I drink sugary sodas daily, eat lots of fruits..." {...field} aria-describedby="dietaryHabits-message" />
                  </FormControl>
                  <FormMessage id="dietaryHabits-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="oralHygieneRoutine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="oralHygieneRoutine-input">Oral Hygiene Routine</FormLabel>
                  <FormControl>
                    <Textarea id="oralHygieneRoutine-input" placeholder="e.g., Brush twice a day, floss occasionally..." {...field} aria-describedby="oralHygieneRoutine-message" />
                  </FormControl>
                  <FormMessage id="oralHygieneRoutine-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dentalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dentalHistory-input">Dental History</FormLabel>
                  <FormControl>
                    <Textarea id="dentalHistory-input" placeholder="e.g., Had braces, a few fillings, gums bleed sometimes..." {...field} aria-describedby="dentalHistory-message" />
                  </FormControl>
                  <FormMessage id="dentalHistory-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Dental Tips
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap">{result.recommendations}</p>
              <p className="text-sm text-destructive mt-4">
                <strong>Disclaimer:</strong> These are AI-generated tips. Always follow the advice of your dental professional for your specific needs.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
