import { HeroSection } from '@/components/HeroSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Users, Smile, Stethoscope } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '@/lib/constants';

const featuredServices = PORTFOLIO_ITEMS.slice(0, 3);

export default function Home() {
  return (
    <div className="space-y-12 md:space-y-20">
      <HeroSection />

      <section className="max-w-[95%] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground">Welcome to Your Dental Home</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            The Green Dental Surgery is committed to providing exceptional dental care for the whole family. 
            Our state-of-the-art facility and experienced team are here to ensure your comfort and health.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Smile className="w-10 h-10 text-primary" />, title: "Expert Care", description: "Highly skilled professionals dedicated to your oral health." },
            { icon: <Users className="w-10 h-10 text-primary" />, title: "Patient Focused", description: "Personalized treatments tailored to your unique needs." },
            { icon: <Stethoscope className="w-10 h-10 text-primary" />, title: "Modern Technology", description: "Utilizing the latest advancements for effective care." },
            { icon: <CheckCircle className="w-10 h-10 text-primary" />, title: "Comfortable Setting", description: "A relaxing environment to make your visit pleasant." },
          ].map((item, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2 font-headline">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-[95%] mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground">Our Featured Services</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            Discover some of the ways we can help you achieve and maintain a healthy, beautiful smile.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="relative h-60 w-full">
                <Image 
                  src={service.imageUrl} 
                  alt={service.title} 
                  layout="fill" 
                  objectFit="cover"
                  data-ai-hint={service.dataAiHint}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-foreground/70 mb-4">{service.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button variant="link" asChild className="p-0 h-auto text-primary hover:underline">
                  <Link href="/portfolio">Learn More &rarr;</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/portfolio">View All Services</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
