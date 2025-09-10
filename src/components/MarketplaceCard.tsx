import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package } from 'lucide-react';
import { MarketplaceItem } from '@/hooks/useMarketplace';
import PurchaseModal from './PurchaseModal';

interface MarketplaceCardProps extends MarketplaceItem {
  className?: string;
}

const MarketplaceCard = ({ 
  id, 
  title, 
  price, 
  condition, 
  location, 
  image, 
  category,
  created_by,
  className = ""
}: MarketplaceCardProps) => {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-2 border-0 bg-card/80 backdrop-blur ${className}`}>
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <Badge className={`absolute top-3 right-3 ${getConditionColor(condition)}`}>
              {condition}
            </Badge>
          </div>

          <div className="p-4">
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
              <div className="flex items-center text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center mb-3">
              <Package className="h-4 w-4 mr-1 text-muted-foreground" />
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>

            {/* Price */}
            <div className="text-xl font-bold text-primary mb-3">
              KSh {price.toLocaleString()}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-gradient-primary" 
            onClick={() => setIsPurchaseModalOpen(true)}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        item={{
          id,
          title,
          price,
          created_by
        }}
      />
    </>
  );
};

export default MarketplaceCard;