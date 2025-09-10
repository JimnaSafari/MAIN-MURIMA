import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import BookingModal from "@/components/BookingModal";
import heroOffice from "@/assets/hero-office.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { locationData, allCounties } from "@/data/locations";

const Office = () => {
  const [selectedCounty, setSelectedCounty] = useState("");
  const [officeType, setOfficeType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Office Spaces | Masskan Murima";
  }, []);

  // Fetch office properties from Supabase with filtering
  const { data: offices = [], isLoading, error } = useQuery({
    queryKey: ["properties", "office", selectedCounty, officeType, priceRange, locationSearch],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("type", "office") // Only fetch office properties
        .order("created_at", { ascending: false });

      // Apply filters
      if (selectedCounty) {
        query = query.ilike("location", `%${selectedCounty}%`);
      }
      if (locationSearch) {
        query = query.ilike("location", `%${locationSearch}%`);
      }
      if (officeType) {
        // Filter by rental_type for office-specific categories
        query = query.ilike("rental_type", officeType);
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
    // Search is handled automatically by the useQuery when state changes
  };

  const handleBookNow = (property) => {
    if (!user) {
      toast.error("Please log in to book an office space");
      return;
    }
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero 
        title="Office Spaces for Rent"
        subtitle="Flexible offices, co-working, and corporate floors in prime locations."
        imageUrl={heroOffice}
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Office Type</label>
                <Select value={officeType} onValueChange={setOfficeType}>
                  <SelectTrigger>
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Office Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cowork">Co-working</SelectItem>
                    <SelectItem value="private">Private Office</SelectItem>
                    <SelectItem value="floor">Whole Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">KSh 0 - 50,000</SelectItem>
                    <SelectItem value="50000-150000">KSh 50,000 - 150,000</SelectItem>
                    <SelectItem value="150000+">KSh 150,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 bg-orange-500 hover:bg-orange-600" onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Available Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Loading office spaces...</p>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">Error loading office spaces. Please try again.</p>
              </div>
            ) : offices.length > 0 ? (
              offices.map((office) => (
                <div key={office.id} onClick={() => handleBookNow(office)}>
                  <PropertyCard
                    id={office.id}
                    title={office.title}
                    location={office.location}
                    price={office.price}
                    priceType={office.price_type as "month" | "night"}
                    rating={office.rating || 4.0}
                    reviews={office.reviews || 0}
                    bedrooms={office.bedrooms}
                    bathrooms={office.bathrooms}
                    area={office.area}
                    image={office.image}
                    type={office.type}
                    featured={office.featured || false}
                    managed_by={office.managed_by || "Landlord"}
                    landlord_name={office.landlord_name || ""}
                    agency_name={office.agency_name || ""}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No office spaces found. Try adjusting your search criteria.</p>
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
          propertyId={selectedProperty.id || ''}
        />
      )}

      <Footer />
    </div>
  );
};

export default Office;
