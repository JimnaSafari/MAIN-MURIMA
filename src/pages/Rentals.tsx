import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useState, useEffect } from "react";
import { Search, MapPin, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import BookingModal from "@/components/BookingModal";
import { allCounties } from "@/data/locations";
import { useRentalProperties } from "@/hooks/useProperties";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Rentals = () => {
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [selectedTown, setSelectedTown] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState(null);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    document.title = "Rentals | Masskan Murima";
  }, []);

  // Build filters for the API call
  const filters = {
    type: "rental",
    ...(selectedCounty && { county: selectedCounty }),
    ...(selectedTown && { town: selectedTown }),
    ...(propertyType && { rental_type: propertyType }),
    ...(searchTerm && { search: searchTerm }),
  };

  const { data: properties = [], isLoading, error, refetch } = useRentalProperties();

  // Filter properties based on local filters (until backend supports all filters)
  const filteredProperties = properties.filter(property => {
    if (selectedCounty && selectedCounty !== "all" && !property.location?.toLowerCase().includes(selectedCounty.toLowerCase())) {
      return false;
    }
    if (selectedTown && !property.location?.toLowerCase().includes(selectedTown.toLowerCase())) {
      return false;
    }
    if (propertyType && propertyType !== "all" && property.rental_type !== propertyType) {
      return false;
    }
    if (searchTerm && !property.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.location?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (priceRange && priceRange !== "all") {
      const price = property.price;
      switch (priceRange) {
        case "under-50k":
          return price < 50000;
        case "50k-100k":
          return price >= 50000 && price < 100000;
        case "100k-200k":
          return price >= 100000 && price < 200000;
        case "over-200k":
          return price >= 200000;
        default:
          return true;
      }
    }
    return true;
  });

  const handleViewDetails = (property: any) => {
    setSelectedPropertyForDetails(property);
    setIsDetailsModalOpen(true);
  };

  const handleBookNow = (property: any) => {
    if (!user) {
      toast.error("Please log in to book a property");
      return;
    }
    setSelectedPropertyForBooking(property);
    setIsBookingModalOpen(true);
  };

  const handleSearch = () => {
    // Trigger a refetch with current filters
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero
        title="Rental Properties"
        subtitle="Find your perfect rental home in prime locations across Kenya."
        imageUrl="/lovable-uploads/f0255d0c-8690-486f-912c-653618f170ca.png"
      />

      {/* Search Form */}
      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Property name or location..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* County */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">County</label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Select county..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {allCounties.map((county) => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Town */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Town/Area</label>
                <Input
                  placeholder="Enter town/area..."
                  className="bg-white/90 border-white/30 focus:border-primary text-black"
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                />
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
                    <SelectValue placeholder="Property type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="bedsitter">Bedsitter</SelectItem>
                    <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                    <SelectItem value="two-bedroom">Two Bedroom</SelectItem>
                    <SelectItem value="three-bedroom">Three Bedroom</SelectItem>
                    <SelectItem value="four-bedroom">Four Bedroom</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Price Range</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
                    <SelectValue placeholder="Price range..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-50k">Under KSh 50,000</SelectItem>
                    <SelectItem value="50k-100k">KSh 50,000 - 100,000</SelectItem>
                    <SelectItem value="100k-200k">KSh 100,000 - 200,000</SelectItem>
                    <SelectItem value="over-200k">Over KSh 200,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch} variant="orange" className="h-12">
                <Filter className="h-4 w-4 mr-2" />
                Search ({filteredProperties.length})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Available Rental Properties</h2>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : error ? (
            <ErrorMessage
              message="Failed to load rental properties. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onBook={() => handleViewDetails(property)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all properties.
              </p>
              <Button
                onClick={() => {
                  setSelectedCounty("all");
                  setSelectedTown("");
                  setPropertyType("all");
                  setPriceRange("all");
                  setSearchTerm("");
                  refetch();
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Property Details Modal */}
      {selectedPropertyForDetails && (
        <PropertyDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPropertyForDetails(null);
          }}
          property={selectedPropertyForDetails}
          onBook={() => {
            setIsDetailsModalOpen(false);
            handleBookNow(selectedPropertyForDetails);
          }}
        />
      )}

      {/* Booking Modal */}
      {selectedPropertyForBooking && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedPropertyForBooking(null);
          }}
          propertyTitle={selectedPropertyForBooking.title}
          propertyId={selectedPropertyForBooking.id.toString()}
        />
      )}

      <Footer />
    </div>
  );
};

export default Rentals;