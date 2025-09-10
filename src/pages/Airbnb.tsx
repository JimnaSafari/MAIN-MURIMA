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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock data for Airbnb properties
const mockAirbnbProperties = [
  {
    id: "kilimani-airbnb-1",
    title: "Luxury Kilimani Apartment",
    location: "Kilimani, Nairobi",
    price: 5000,
    price_type: "night",
    rating: 4.9,
    reviews: 35,
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    image: "/kilimani-airbnb-1.jpeg",
    images: [
      "/kilimani-airbnb-1.jpeg",
      "/kilimani-airbnb-2.jpeg",
      "/kilimani-airbnb-3.jpeg",
      "/kilimani-airbnb-4.jpeg",
    ],
    type: "airbnb",
    featured: true,
    managed_by: "Landlord",
    landlord_name: "Jane Doe",
  },
  {
    id: "kilimani-airbnb-2",
    title: "Cozy Studio in Kilimani",
    location: "Kilimani, Nairobi",
    price: 3500,
    price_type: "night",
    rating: 4.7,
    reviews: 20,
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    image: "/Kilimani 1.jpeg",
    images: [
      "/Kilimani 1.jpeg",
      "/Kilimani 2.jpeg",
      "/Kilimani 3.jpeg",
      "/Kilimani 4.jpeg",
      "/Kilimani 5.jpeg",
      "/Kilimani 6.jpeg",
      "/Kilimani 7.jpeg",
    ],
    type: "airbnb",
    featured: false,
    managed_by: "Agency",
    agency_name: "Kilimani Stays",
  },
  {
    id: "chuka-airbnb-1",
    title: "Chuka Getaway Home",
    location: "Chuka, Meru",
    price: 2500,
    price_type: "night",
    rating: 4.5,
    reviews: 15,
    bedrooms: 2,
    bathrooms: 1,
    area: 900,
    image: "/Chuka 1.jpeg",
    images: [
      "/Chuka 1.jpeg",
      "/Chuka 2.jpeg",
      "/Chuka 3.jpeg",
      "/Chuka 4.jpeg",
      "/Chuka 5.jpeg",
      "/Chuka 6.jpeg",
    ],
    type: "airbnb",
    featured: false,
    managed_by: "Landlord",
    landlord_name: "Peter Njoroge",
  },
];

const Airbnb = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [guests, setGuests] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { user } = useAuth();

  // Filter mock data based on selected criteria
  const filteredProperties = mockAirbnbProperties.filter((property) => {
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

  const properties = filteredProperties; // Use filtered mock data
  const isLoading = false; // No loading for mock data
  const error = null; // No error for mock data

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <Select onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
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
              <Button className="h-12 bg-orange-500 hover:bg-orange-600 text-white">
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Featured Stays</h2>
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
        </div>
      </section>

      {selectedProperty && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          propertyTitle={selectedProperty.title}
          propertyId={selectedProperty.id || ''}
        />
      )}

      <Footer />
    </div>
  );
};

export default Airbnb;
