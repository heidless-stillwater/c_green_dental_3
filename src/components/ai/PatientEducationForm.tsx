"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getPatientEducationInfo, type PatientEducationOutput } from '@/ai/flows/ai-patient-education';
import { Loader2, BookOpenText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


const formSchema = z.object({
  topic: z.string().min(3, { message: "Please enter a dental topic (at least 3 characters)." }),
});

export default function PatientEducationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PatientEducationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await getPatientEducationInfo(values);
      setResult(response);
    } catch (error: any) {
      console.error('Patient Education Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Getting Information',
        description: error.message || 'Failed to generate educational content. Please try a different topic or try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BookOpenText className="h-6 w-6 text-primary" /> AI Patient Education
        </CardTitle>
        <CardDescription>
          Enter a dental health topic you'd like to learn more about. Our AI will provide an overview and key information.
          This is for educational purposes only.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="topic-education-input">Dental Health Topic</FormLabel>
                  <FormControl>
                    <Input
                      id="topic-education-input"
                      placeholder="e.g., Gum disease, Teeth whitening, Cavity prevention"
                      {...field}
                      aria-describedby="topic-education-message"
                    />
                  </FormControl>
                  <FormMessage id="topic-education-message" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching Information...
                </>
              ) : (
                <>
                  <BookOpenText className="mr-2 h-4 w-4" /> Learn About Topic
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
              <CardTitle className="font-headline text-xl">{result.topicTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/80 whitespace-pre-wrap">{result.introduction}</p>
              
              {result.sections && result.sections.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-foreground/90 mb-2 mt-4">Detailed Information:</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {result.sections.map((section, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-md font-medium hover:no-underline text-left">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/80 whitespace-pre-wrap">
                          {section.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {result.keyTakeaways && (
                <div className="mt-4">
                  <h4 className="font-semibold text-md text-foreground/90">Key Takeaways:</h4>
                  <p className="text-foreground/80 whitespace-pre-wrap">{result.keyTakeaways}</p>
                </div>
              )}

              <div className="pt-3 mt-4 border-t border-border">
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
