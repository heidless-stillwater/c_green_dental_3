// src/components/ai/DentalInsuranceHelperForm.tsx
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
import { getDentalInsuranceGuidance, type DentalInsuranceHelperOutput } from '@/ai/flows/ai-dental-insurance-helper';
import { Loader2, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  insuranceProvider: z.string().min(2, { message: 'Insurance provider name is required (e.g., Delta Dental, MetLife).' }),
  planDetails: z.string().min(20, { message: 'Please provide some key details about your plan (at least 20 characters).' }),
  dentalProcedure: z.string().min(5, { message: 'Please describe the dental procedure (at least 5 characters).' }),
  estimatedProcedureCost: z.coerce.number().positive({ message: "If providing a cost, it must be a positive number."}).optional(),
});

export default function DentalInsuranceHelperForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DentalInsuranceHelperOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceProvider: '',
      planDetails: '',
      dentalProcedure: '',
      estimatedProcedureCost: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getDentalInsuranceGuidance(values);
      setResult(response);
    } catch (error: any) {
      console.error('Dental Insurance Helper Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Getting Guidance',
        description: error.message || 'Failed to get insurance guidance. Please check your input and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> AI Dental Insurance Helper
        </CardTitle>
        <CardDescription>
          Get AI-powered guidance on your potential dental insurance coverage.
          This tool provides an estimate and general information, not a guarantee of coverage.
          Always confirm details with your insurance provider.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="insuranceProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="insuranceProvider-input">Insurance Provider Name</FormLabel>
                  <FormControl>
                    <Input id="insuranceProvider-input" placeholder="e.g., Delta Dental, MetLife, Cigna" {...field} aria-describedby="insuranceProvider-message" />
                  </FormControl>
                  <FormMessage id="insuranceProvider-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="planDetails-input">Key Plan Details</FormLabel>
                  <FormControl>
                    <Textarea
                      id="planDetails-input"
                      placeholder="e.g., PPO Plan, $50 annual deductible, 80% coverage for fillings, 50% for crowns, $1500 annual max. Waiting period for major work is 12 months."
                      rows={4}
                      {...field}
                      aria-describedby="planDetails-message"
                    />
                  </FormControl>
                  <FormMessage id="planDetails-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dentalProcedure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="dentalProcedure-input">Dental Procedure in Question</FormLabel>
                  <FormControl>
                    <Input id="dentalProcedure-input" placeholder="e.g., Root canal on tooth #14, Full mouth X-rays and exam, Dental implant" {...field} aria-describedby="dentalProcedure-message" />
                  </FormControl>
                  <FormMessage id="dentalProcedure-message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedProcedureCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="estimatedProcedureCost-input">Estimated Cost of Procedure (Optional)</FormLabel>
                  <FormControl>
                    <Input id="estimatedProcedureCost-input" type="number" placeholder="e.g., 1200" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} aria-describedby="estimatedProcedureCost-message"/>
                  </FormControl>
                  <FormMessage id="estimatedProcedureCost-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Get Insurance Guidance
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
              <CardTitle className="font-headline text-lg">AI Insurance Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground/90">Coverage Guidance:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.coverageGuidance}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Estimated Out-of-Pocket:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.estimatedOutOfPocket}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Potential Limitations & Considerations:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.potentialLimitations}</p>
              </div>
               <div>
                <h4 className="font-semibold text-foreground/90">Recommended Next Steps:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.nextStepsRecommendation}</p>
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
