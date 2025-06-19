import { ContactInfo } from '@/components/ContactInfo';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Basic ContactForm component for UI completeness
// In a real app, this would use react-hook-form and a server action
function ContactForm() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
        <CardDescription>We'll get back to you as soon as possible.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">Full Name</label>
              <Input type="text" id="name" placeholder="Your Name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
              <Input type="email" id="email" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground/80 mb-1">Subject</label>
            <Input type="text" id="subject" placeholder="Inquiry Subject" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1">Message</label>
            <Textarea id="message" placeholder="Your message..." rows={5} />
          </div>
          <div>
            <Button type="submit" className="w-full sm:w-auto">Send Message</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}


export default function ContactPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold text-foreground">Get in Touch</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          We're here to help with all your dental needs. Contact us today to schedule an appointment or ask any questions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <ContactInfo />
        </div>
        <div className="lg:col-span-2">
           <ContactForm />
        </div>
      </div>
       <InteractiveMap />
    </div>
  );
}
