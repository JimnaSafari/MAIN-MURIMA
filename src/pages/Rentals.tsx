import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import BookingModal from "@/components/BookingModal";
import { locationData, allCounties } from "@/data/locations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock data for properties
const mockProperties = [
  {
    id: "9d0ffa08-2df5-4a11-91da-662952d7a8a2",
    title: "Spacious Family Home",
    location: "Nairobi West",
    price: 150000,
    priceType: "month" as const,
    rating: 4.5,
    reviews: 120,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    image: "/three-bedroom.jpg",
    type: "House",
    featured: true,
    managed_by: "Landlord",
    landlord_name: "John Doe",
  },
  {
    id: "694ee174-ced2-4593-8941-e40fe063a0bd",
    title: "Modern Apartment in CBD",
    location: "Nairobi CBD",
    price: 80000,
    priceType: "month" as const,
    rating: 4.8,
    reviews: 95,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: "/two-bedroom.jpg",
    type: "Apartment",
    managed_by: "Agency",
    agency_name: "Prime Properties",
  },
  {
    id: "75f43f63-863b-46cf-b74f-394859dc6c33",
    title: "Cozy Studio Flat",
    location: "Westlands",
    price: 45000,
    priceType: "month" as const,
    rating: 4.2,
    reviews: 60,
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    image: "/one-bedroom.jpg",
    type: "Studio",
  },
  {
    id: "b86556b4-6410-47f5-9662-6b81dc785d19",
    title: "Single Room",
    location: "Kasarani",
    price: 10000,
    priceType: "month" as const,
    rating: 4.0,
    reviews: 20,
    bedrooms: 1,
    bathrooms: 1,
    area: 200,
    image: "/single-room.jpg",
    type: "Single",
  },
  {
    id: "d374694a-4354-4427-926a-5a36bbc38130",
    title: "Bedsitter",
    location: "Roysambu",
    price: 15000,
    priceType: "month" as const,
    rating: 4.1,
    reviews: 30,
    bedrooms: 1,
    bathrooms: 1,
    area: 300,
    image: "/bedsitter.jpg",
    type: "Bedsitter",
  },
];

const Rentals = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    document.title = "Rentals | Masskan Murima";
  }, []);

  // Fetch properties from Supabase with filtering
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ["properties", "rental", selectedCounty, selectedTown, propertyType, priceRange],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("type", "rental") // Only fetch rental properties
        .order("created_at", { ascending: false });

      // Apply filters
      if (selectedCounty) {
        query = query.ilike("location", `%${selectedCounty}%`);
      }
      if (selectedTown) {
        query = query.ilike("location", `%${selectedTown}%`);
      }
      if (propertyType) {
        query = query.ilike("rental_type", propertyType);
      }
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        if (max) {
          query = query.gte("price", min).lte("price", max);
        } else {
          query = query.gte("price", min);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const handleSearch = () => {
    // Filtering is now handled by the query, but we could add client-side filtering here if needed
    // For now, the search will refetch data based on filters
  };

  const handleBookNow = (property) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const towns = selectedCounty ? locationData[selectedCounty] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <PageHero 
        title="Find Your Perfect Rental Home"
        subtitle="Discover long-term rental properties with detailed information, virtual tours, and verified landlords."
        imageUrl="/hero-rentals.jpg"
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Select County</label>
                <Select 
                  value={selectedCounty} 
                  onValueChange={setSelectedCounty}
                >
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
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
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
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
                <label className="text-sm font-medium text-white/80">Property Type</label>
                <Select 
                  value={propertyType} 
                  onValueChange={setPropertyType}
                >
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Property..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="bedsitter">Bedsitter</SelectItem>
                    <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                    <SelectItem value="two-bedroom">Two Bedroom</SelectItem>
                    <SelectItem value="three-bedroom">Three Bedroom</SelectItem>
                    <SelectItem value="four-bedroom">Four Bedroom</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Price Range</label>
                <Select 
                  value={priceRange} 
                  onValueChange={setPriceRange}
                >
                  <SelectTrigger>
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100000">KSh 0 - KSh 100,000</SelectItem>
                    <SelectItem value="100000-200000">KSh 100,000 - KSh 200,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                  <Button onClick={handleSearch} className="h-12 bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.id} onClick={() => handleBookNow(property)}>
                  <PropertyCard
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
                    type={property.type}
                    featured={property.featured || false}
                    managed_by={property.managed_by || "Landlord"}
                    landlord_name={property.landlord_name || ""}
                    agency_name={property.agency_name || ""}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground col-span-full">No properties found. Try adjusting your search criteria.</p>
            )}
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

export default Rentals;
