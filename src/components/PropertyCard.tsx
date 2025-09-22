import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  price: number | string;
  price_type?: string;
  priceType?: "month" | "night";
  rating: number | string | null;
  reviews?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string; // Primary image
  images?: string[] | null; // Array of additional images for carousel
  type: string;
  featured?: boolean;
  managed_by?: string;
  landlord_name?: string;
  agency_name?: string;
  onBook?: () => void;
}

const PropertyCard = ({
  title,
  location,
  price,
  price_type,
  priceType,
  rating,
  reviews = 0,
  bedrooms,
  bathrooms,
  area,
  image,
  images,
  type,
  featured = false,
  managed_by,
  landlord_name,
  agency_name,
  onBook
}: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const imageArray = images && images.length > 0 ? images : [image];
  const hasMultipleImages = imageArray.length > 1;

  // debugging: remove after testing
  useEffect(() => {
    console.log('PropertyCard images:', imageArray);
  }, [imageArray]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    // initialize selected index immediately
    onSelect();
    return () => {
      // call off inside cleanup (returning void)
      if (emblaApi && typeof emblaApi.off === "function") emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      // re-initialize when images change so embla recalculates sizes
      if (typeof emblaApi.reInit === 'function') emblaApi.reInit();
    }
  }, [imageArray, emblaApi]);

  const scrollPrev = () => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    const prevIndex = current === 0 ? imageArray.length - 1 : current - 1;
    emblaApi.scrollTo(prevIndex);
  };
  const scrollNext = () => {
    if (!emblaApi) return;
    const current = emblaApi.selectedScrollSnap();
    const nextIndex = current === imageArray.length - 1 ? 0 : current + 1;
    emblaApi.scrollTo(nextIndex);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 border-0 bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Image Container */}
      <div className="relative overflow-hidden">
        {hasMultipleImages ? (
          <>
            <div className="embla">
              <div className="embla__viewport overflow-hidden" ref={emblaRef}>
                <div className="embla__container flex">
                  {imageArray.map((src, index) => (
                    <div className="embla__slide flex-none min-w-full" key={index}>
                      <img
                        src={src || `https://via.placeholder.com/400x300.png?text=${title.replace(/\s/g, "+")}`}
                        alt={`${title} - ${index + 1}`}
                        className="w-full h-52 object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Navigation arrows */}
              <button
                aria-label="Previous image"
                onClick={scrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </button>
              <button
                aria-label="Next image"
                onClick={scrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20 transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl"
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </button>
            </div>

            {/* Enhanced Image Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              {imageArray.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? 'bg-white scale-125 shadow-lg'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src={imageArray[0] || `https://via.placeholder.com/400x300.png?text=${title.replace(/\s/g, "+")}`}
            alt={title}
            className="w-full h-52 object-cover transition-all duration-700 group-hover:scale-110"
          />
        )}

        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {featured && (
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg">
              ⭐ Featured
            </Badge>
          )}
          <Badge variant="outline" className="bg-white/95 backdrop-blur-sm text-slate-700 border-slate-200/50 shadow-sm">
            {type}
          </Badge>
        </div>

        {/* Enhanced Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white border border-white/20 shadow-lg transition-all duration-300 hover:scale-110 p-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${
            isFavorited
              ? 'fill-red-500 text-red-500 scale-110'
              : 'text-slate-600 hover:text-red-400'
          }`} />
        </Button>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-3 py-1">
          <span className="font-bold text-primary">
            KSh {typeof price === 'string' ? parseFloat(price).toLocaleString() : price.toLocaleString()}
            <span className="text-sm text-muted-foreground">
              /{priceType || price_type || (type === "Airbnb" ? "night" : "month")}
            </span>
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Managed by */}
        {managed_by && (
          <div className="mb-3">
            <Badge variant={managed_by === 'Landlord' ? 'default' : 'secondary'}>
              {managed_by === 'Landlord' ? 'Landlord' : 'Managed by an Agency'}
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium text-sm">{rating || "No rating"}</span>
          <span className="text-muted-foreground text-sm ml-1">
            ({reviews || 0} reviews)
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{area} sqft</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            if (onBook) {
              onBook();
            }
          }}
        >
          {type.toLowerCase() === "airbnb" ? "Book Now" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
