
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
import { assistWithAppointment, type AiAppointmentRequestOutput } from '@/ai/flows/ai-appointment-scheduler';
import { Loader2, CalendarPlus } from 'lucide-react';

const formSchema = z.object({
  userRequest: z.string().min(10, { message: "Please describe your appointment request in at least 10 characters." }),
});

export default function AppointmentSchedulerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiAppointmentRequestOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userRequest: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await assistWithAppointment(values);
      setResult(response);
    } catch (error: any) {
      console.error('AI Appointment Scheduler Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Processing Request',
        description: error.message || 'Failed to process your appointment request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <CalendarPlus className="h-6 w-6 text-primary" /> AI Appointment Assistant
        </CardTitle>
        <CardDescription>
          Tell us what kind of appointment you need and any preferences you have. Our AI will help you formulate your request and guide you on how to book with us.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="userRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="userRequest-appointment-input">Your Appointment Request</FormLabel>
                  <FormControl>
                    <Textarea
                      id="userRequest-appointment-input"
                      placeholder="e.g., I'd like to book a dental cleaning for next Tuesday afternoon. OR I have a toothache and need to see a dentist soon."
                      rows={4}
                      {...field}
                      aria-describedby="userRequest-appointment-message"
                    />
                  </FormControl>
                  <FormMessage id="userRequest-appointment-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Request...
                </>
              ) : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" /> Get Appointment Info
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
              <CardTitle className="font-headline text-lg">Appointment Request Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground/90">AI Confirmation:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.confirmationMessage}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Understood Service:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.parsedService}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90">Understood Date/Time Preferences:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.parsedDateTime}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground/90 text-primary">Next Steps to Book Your Appointment:</h4>
                <p className="text-foreground/80 whitespace-pre-wrap">{result.suggestedNextSteps}</p>
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

