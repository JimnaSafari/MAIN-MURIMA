import PropertyCard from "./PropertyCard";
import PropertyDetailsModal from "./PropertyDetailsModal";
import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useFeaturedProperties } from "@/hooks/useProperties";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const FeaturedProperties = ({ searchResults }: { searchResults?: any[] }) => {
  const { data: properties, isLoading, error, refetch } = useFeaturedProperties();
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const displayProperties = searchResults || properties;

  const handleViewDetails = (property: any) => {
    if (property.type === "Airbnb") {
      // For Airbnb properties, open booking modal directly
      handleBookNow(property);
    } else {
      // For other properties, open details modal
      setSelectedProperty(property);
      setIsDetailsModalOpen(true);
    }
  };

  const handleBookNow = (property: any) => {
    if (!user) {
      toast.error("Please log in to book a property");
      return;
    }
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ErrorMessage 
            message="Failed to load featured properties. Please try again." 
            onRetry={() => refetch()}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover our handpicked selection of premium properties and stays.
            </p>
          </div>
          <Button variant="outline" size="lg" className="mt-4 md:mt-0">
            View All Properties
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProperties && displayProperties.length > 0 ? (
            displayProperties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onBook={() => handleViewDetails(property)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No featured properties available at the moment.</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-gradient-card rounded-2xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">📍</div>
            <div className="text-muted-foreground">Prime Locations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">✅</div>
            <div className="text-muted-foreground">Verified Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">🏠</div>
            <div className="text-muted-foreground">Quality Assurance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">🤝</div>
            <div className="text-muted-foreground">Trusted Service</div>
          </div>
        </div>

        {/* Property Details Modal */}
        {selectedProperty && (
          <PropertyDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedProperty(null);
            }}
            property={selectedProperty}
          />
        )}

        {/* Booking Modal */}
        {selectedProperty && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedProperty(null);
            }}
            propertyTitle={selectedProperty.title}
            propertyId={selectedProperty.id || ''}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
