import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative max-w-[95%] mx-auto py-16 md:py-24 rounded-lg overflow-hidden shadow-xl">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1200x600.png"
          alt="Dental clinic interior"
          data-ai-hint="dental clinic"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
          Your Brightest Smile, Our Priority
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          At The Green Dental Surgery, we provide comprehensive dental care in a warm and welcoming environment. Experience modern dentistry with a personal touch.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/contact">Book Appointment</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-semibold">
            <Link href="/portfolio">Explore Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
