import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Truck, CheckCircle, ChevronDown } from 'lucide-react';
import { MovingService } from '@/hooks/useMovingServices';
import SimpleQuoteModal from './SimpleQuoteModal';

interface MovingServiceCardProps {
  service: MovingService;
  className?: string;
}

const MovingServiceCard = ({ service, className = "" }: MovingServiceCardProps) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/80 backdrop-blur ${className}`}>
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={service.image || '/hero-movers.png'}
              alt={service.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/hero-movers.png';
              }}
            />
            {service.verified && (
              <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <div className="p-4">
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{service.name}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{service.location}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  ({service.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Services */}
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm font-medium">Services:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {service.services.slice(0, 3).map((serviceItem, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {serviceItem}
                  </Badge>
                ))}
                {service.services.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{service.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="text-lg font-bold text-primary mb-3">
              {service.price_range}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-gradient-primary flex items-center justify-center gap-2" 
            onClick={() => setIsQuoteModalOpen(true)}
          >
            Get Quick Quote
            <ChevronDown className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      <SimpleQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        serviceId={service.id}
        serviceName={service.name}
      />
    </>
  );
};

export default MovingServiceCard;