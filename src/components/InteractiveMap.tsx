"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CONTACT_DETAILS } from '@/lib/constants';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

export function InteractiveMap() {
  const [mapActive, setMapActive] = useState(false);

  if (!mapActive) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6 text-center">
            <div className="relative w-full h-64 md:h-80 rounded-md overflow-hidden mb-4 border border-border">
                <Image 
                    src="https://placehold.co/800x400.png" 
                    alt="Map placeholder" 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="map location"
                />
                 <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button onClick={() => setMapActive(true)} size="lg">
                        Load Interactive Map
                    </Button>
                 </div>
            </div>
            <p className="text-sm text-muted-foreground">Click the button to load and interact with the map.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
        <CardContent className="p-2 md:p-4">
            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden border border-border">
            <iframe
                src={CONTACT_DETAILS.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location of The Green Dental Surgery"
            ></iframe>
            </div>
      </CardContent>
    </Card>
  );
}
