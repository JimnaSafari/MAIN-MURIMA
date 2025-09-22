import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useState, useEffect } from "react";
import { Search, MapPin, Filter, Loader2, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import BookingModal from "@/components/BookingModal";
import { allCounties } from "@/data/locations";
import { useOfficeProperties } from "@/hooks/useProperties";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Office = () => {
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [officeType, setOfficeType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState(null);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    document.title = "Office Space | Masskan Murima";
  }, []);

  const { data: offices = [], isLoading, error, refetch } = useOfficeProperties();

  // Filter offices based on local criteria
  const filteredOffices = offices.filter(office => {
    if (selectedCounty && selectedCounty !== "all" && !office.location?.toLowerCase().includes(selectedCounty.toLowerCase())) {
      return false;
    }
    if (locationSearch && !office.location?.toLowerCase().includes(locationSearch.toLowerCase()) &&
        !office.title?.toLowerCase().includes(locationSearch.toLowerCase())) {
      return false;
    }
    if (officeType && officeType !== "all" && office.rental_type !== officeType) {
      return false;
    }
    if (priceRange && priceRange !== "all") {
      const price = office.price;
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
      toast.error("Please log in to book an office space");
      return;
    }
    setSelectedPropertyForBooking(property);
    setIsBookingModalOpen(true);
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero
        title="Office Spaces"
        subtitle="Professional office spaces in prime business locations across Kenya."
        imageUrl="/lovable-uploads/f0255d0c-8690-486f-912c-653618f170ca.png"
      />

      {/* Search Form */}
      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Location Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search location..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
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

              {/* Office Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Office Type</label>
                <Select value={officeType} onValueChange={setOfficeType}>
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
                    <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="Office type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="private-office">Private Office</SelectItem>
                    <SelectItem value="shared-office">Shared Office</SelectItem>
                    <SelectItem value="meeting-room">Meeting Room</SelectItem>
                    <SelectItem value="coworking">Co-working Space</SelectItem>
                    <SelectItem value="virtual-office">Virtual Office</SelectItem>
                    <SelectItem value="business-center">Business Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Monthly Rent</label>
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
                Search ({filteredOffices.length})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Office Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={officeType === "private-office" ? "default" : "outline"}
              size="sm"
              onClick={() => setOfficeType("private-office")}
            >
              Private Offices
            </Button>
            <Button
              variant={officeType === "shared-office" ? "default" : "outline"}
              size="sm"
              onClick={() => setOfficeType("shared-office")}
            >
              Shared Offices
            </Button>
            <Button
              variant={officeType === "meeting-room" ? "default" : "outline"}
              size="sm"
              onClick={() => setOfficeType("meeting-room")}
            >
              Meeting Rooms
            </Button>
            <Button
              variant={officeType === "coworking" ? "default" : "outline"}
              size="sm"
              onClick={() => setOfficeType("coworking")}
            >
              Co-working
            </Button>
            <Button
              variant={officeType === "virtual-office" ? "default" : "outline"}
              size="sm"
              onClick={() => setOfficeType("virtual-office")}
            >
              Virtual Offices
            </Button>
          </div>
        </div>
      </section>

      {/* Office Spaces Grid */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Available Office Spaces</h2>
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
              message="Failed to load office spaces. Please try again."
              onRetry={() => refetch()}
            />
          ) : filteredOffices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOffices.map((office) => (
                <PropertyCard
                  key={office.id}
                  {...office}
                  onBook={() => handleViewDetails(office)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-semibold mb-2">No office spaces found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all available spaces.
              </p>
              <Button
                onClick={() => {
                  setSelectedCounty("all");
                  setOfficeType("all");
                  setPriceRange("all");
                  setLocationSearch("");
                  refetch();
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Office Spaces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Why Choose Our Office Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Prime Locations</h3>
              <p className="text-muted-foreground">
                Strategic locations in major business districts with excellent connectivity.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Modern Facilities</h3>
              <p className="text-muted-foreground">
                Fully equipped offices with high-speed internet, meeting rooms, and modern amenities.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Flexible Terms</h3>
              <p className="text-muted-foreground">
                Flexible lease terms from short-term rentals to long-term agreements.
              </p>
            </div>
          </div>
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

export default Office;