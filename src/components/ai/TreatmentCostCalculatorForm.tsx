
// src/components/ai/TreatmentCostCalculatorForm.tsx
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
import { getTreatmentCostEstimate, type TreatmentCostCalculatorOutput } from '@/ai/flows/ai-treatment-cost-calculator';
import { Loader2, Calculator } from 'lucide-react';

const formSchema = z.object({
  procedureDescription: z.string().min(5, { message: "Please describe the dental procedure (at least 5 characters)." }),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Please enter a valid 5-digit or 9-digit ZIP code (e.g., 90210 or 90210-1234)."}).optional().or(z.literal('')),
  insuranceInfo: z.string().optional(),
});

export default function TreatmentCostCalculatorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TreatmentCostCalculatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      procedureDescription: '',
      zipCode: '',
      insuranceInfo: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getTreatmentCostEstimate({
        ...values,
        zipCode: values.zipCode || undefined, // Send undefined if empty
        insuranceInfo: values.insuranceInfo || undefined,
      });
      setResult(response);
    } catch (error: any) {
      console.error('Treatment Cost Calculator Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Getting Estimate',
        description: error.message || 'Failed to generate a cost estimate. Please check your input and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" /> AI Treatment Cost Calculator
        </CardTitle>
        <CardDescription>
          Get a general AI-powered estimate for dental procedures. This tool provides broad cost ranges and informational guidance only.
          It is NOT a quote. Always consult your dentist for an accurate cost.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="procedureDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="procedureDescription-cost-input">Dental Procedure</FormLabel>
                  <FormControl>
                    <Input
                      id="procedureDescription-cost-input"
                      placeholder="e.g., Routine cleaning, Filling for one cavity, Wisdom tooth extraction"
                      {...field}
                      aria-describedby="procedureDescription-cost-message"
                    />
                  </FormControl>
                  <FormMessage id="procedureDescription-cost-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="zipCode-cost-input">Your 5-Digit ZIP Code (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      id="zipCode-cost-input"
                      placeholder="e.g., 90210 (helps AI consider regional variations generally)"
                      {...field}
                      aria-describedby="zipCode-cost-message"
                    />
                  </FormControl>
                  <FormMessage id="zipCode-cost-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="insuranceInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insuranceInfo-cost-input">Dental Insurance Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="insuranceInfo-cost-input"
                      placeholder="e.g., 'No insurance', 'Delta Dental PPO', 'MetLife - basic plan'"
                      rows={3}
                      {...field}
                      aria-describedby="insuranceInfo-cost-message"
                    />
                  </FormControl>
                  <FormMessage id="insuranceInfo-cost-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating Estimate...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" /> Get Cost Estimate
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
              <CardTitle className="font-headline text-lg">AI Cost Estimation & Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground/90">Estimated Cost Range:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.estimatedCostRange}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Factors Influencing Cost:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.factorsInfluencingCost}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Insurance Considerations:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.insuranceConsiderations}</p>
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
