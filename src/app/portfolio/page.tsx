import { PortfolioCard } from '@/components/PortfolioCard';
import { PORTFOLIO_ITEMS } from '@/lib/constants';

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-semibold text-foreground">Our Dental Services</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          We offer a comprehensive range of dental treatments to meet all your oral health needs. 
          Explore our services to find out how we can help you achieve a healthy and beautiful smile.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PORTFOLIO_ITEMS.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
