import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { PortfolioItem } from '@/lib/constants';
import { Button } from './ui/button';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full h-60">
        <Image
          src={item.imageUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          data-ai-hint={item.dataAiHint}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base text-foreground/70">{item.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Learn More</Button>
      </CardFooter>
    </Card>
  );
}
