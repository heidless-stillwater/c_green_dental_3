import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTACT_DETAILS } from '@/lib/constants';
import { MapPin, Globe, Mail, Phone } from 'lucide-react';

export function ContactInfo() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Our Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <p className="text-foreground/80">{CONTACT_DETAILS.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary flex-shrink-0" />
          <a href={`http://${CONTACT_DETAILS.website}`} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
            {CONTACT_DETAILS.website}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
          <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-foreground/80 hover:text-primary transition-colors">
            {CONTACT_DETAILS.email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary flex-shrink-0" />
          <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, '')}`} className="text-foreground/80 hover:text-primary transition-colors">
            {CONTACT_DETAILS.phone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
