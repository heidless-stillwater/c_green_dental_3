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
import { treatmentPlanner, type TreatmentPlannerOutput } from '@/ai/flows/ai-treatment-planner';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  dentalCondition: z.string().min(20, { message: 'Please describe your dental condition, symptoms, and any relevant medical history in at least 20 characters.' }),
});

export default function TreatmentPlannerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TreatmentPlannerOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dentalCondition: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await treatmentPlanner(values);
      setResult(response);
    } catch (error) {
      console.error('Treatment Planner Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get treatment plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline">AI Treatment Planner</CardTitle>
        <CardDescription>Describe your dental condition for personalized treatment recommendations. This tool provides general suggestions and is not a substitute for a professional dental consultation.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="dentalCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dentalCondition-input">Dental Condition & History</FormLabel>
                  <FormControl>
                    <Textarea
                      id="dentalCondition-input"
                      placeholder="e.g., I have a chipped front tooth from an accident last year. It's sensitive to cold. I have no other major health issues..."
                      rows={6}
                      {...field}
                      aria-describedby="dentalCondition-message"
                    />
                  </FormControl>
                  <FormMessage id="dentalCondition-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Treatment Plan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Treatment Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-foreground/90">Recommendations:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.treatmentRecommendations}</p>
              </div>
              {result.additionalInformation && (
                <div>
                  <h4 className="font-semibold text-foreground/90">Additional Information:</h4>
                  <p className="text-foreground/80 whitespace-pre-wrap">{result.additionalInformation}</p>
                </div>
              )}
              <p className="text-sm text-destructive">
                <strong>Disclaimer:</strong> This AI-generated plan is for informational purposes only. A thorough examination by a qualified dentist is necessary for an accurate diagnosis and treatment plan.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}
