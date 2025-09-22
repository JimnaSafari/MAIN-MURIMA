import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHero from "@/components/PageHero";
import { useState } from "react";
import { locationData, allCounties } from "@/data/locations";
import BookingModal from "@/components/BookingModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroAirbnb from "@/assets/hero-airbnb.jpg";
import { useAirbnbProperties } from "@/hooks/useProperties";

const Airbnb = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [guests, setGuests] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { user } = useAuth();

  // Fetch Airbnb properties from backend
  const { data: airbnbProperties = [], isLoading, error, refetch } = useAirbnbProperties();

  // Filter data based on selected criteria
  const filteredProperties = airbnbProperties.filter((property) => {
    let matches = true;

    if (selectedCounty && !property.location.includes(selectedCounty)) {
      matches = false;
    }
    if (selectedTown && !property.location.includes(selectedTown)) {
      matches = false;
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      if (max && (property.price < min || property.price > max)) {
        matches = false;
      } else if (!max && property.price < min) {
        matches = false;
      }
    }
    if (guests) {
      const minBedrooms = guests === "4+" ? 4 : parseInt(guests);
      if (property.bedrooms < minBedrooms) {
        matches = false;
      }
    }
    return matches;
  });

  const properties = filteredProperties; // Use filtered backend data

  const handleBookNow = (property) => {
    if (!user) {
      toast.error("Please log in to book a property");
      return;
    }
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const towns = selectedCounty ? locationData[selectedCounty] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero
        title="Airbnb Stays"
        subtitle="Experience Kenyan hospitality with our unique stays."
        imageUrl={heroAirbnb}
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Select County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Select Town</label>
                <Select
                  value={selectedTown}
                  onValueChange={setSelectedTown}
                  disabled={!selectedCounty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select town..." />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((town) => (
                      <SelectItem key={town.name} value={town.name}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Price per night</label>
                <Select onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10000">KSh 0 - KSh 10,000</SelectItem>
                    <SelectItem value="10000-20000">KSh 10,000 - KSh 20,000</SelectItem>
                    <SelectItem value="20000+">KSh 20,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Guests</label>
                <Select onValueChange={setGuests}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4+">4+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="orange" className="h-12">
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-sky-50/20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-sky-100/30">
            <h2 className="text-2xl font-bold mb-8">Featured Stays</h2>
            {isLoading ? (
              <div className="text-center py-8">Loading Airbnb properties...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading Airbnb properties: {error.message}</div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8">No Airbnb properties found. Debug: Backend returned {airbnbProperties.length} properties</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  priceType={property.price_type as "month" | "night"}
                  rating={property.rating || 4.0}
                  reviews={property.reviews || 0}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  image={property.image}
                  images={property.images} /* Pass the array of images */
                  type={property.type}
                  featured={property.featured || false}
                  managed_by={property.managed_by || "Landlord"}
                  landlord_name={property.landlord_name || ""}
                  agency_name={property.agency_name || ""}
                  onBook={() => handleBookNow(property)}
                />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedProperty && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          propertyTitle={selectedProperty.title}
          propertyId={selectedProperty.id.toString()}
        />
      )}

      <Footer />
    </div>
  );
};

export default Airbnb;
