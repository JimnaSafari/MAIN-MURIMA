import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMovingServices } from "@/hooks/useMovingServices";
import MovingServiceCard from "@/components/MovingServiceCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { allCounties } from "@/data/locations";

// Mock data for properties (from Rentals.tsx, not directly used here but for context)
// const mockProperties = [...] 


const Movers = () => {
  const [locationInput, setLocationInput] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [searchFilters, setSearchFilters] = useState({});

  const { data: movingServices, isLoading, error, refetch } = useMovingServices(searchFilters);

  useEffect(() => {
    document.title = "Movers | Masskan Murima";
  }, []);

  const handleSearch = () => {
    const filters = {
      location: locationInput || undefined,
      search: serviceType || undefined,
    };
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <PageHero 
        title="Professional Moving Services"
        subtitle="Find trusted movers, compare quotes, and book with confidence."
        imageUrl="/lovable-uploads/f0255d0c-8690-486f-912c-653618f170ca.png"
      />

      {/* Search Form */}
      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* County Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Select County</label>
                <Select
                  value={locationInput}
                  onValueChange={setLocationInput}
                >
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
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

              {/* Service Type Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Service Type</label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Move (Same City)</SelectItem>
                    <SelectItem value="long-distance">Long Distance Move</SelectItem>
                    <SelectItem value="interstate">Interstate Move</SelectItem>
                    <SelectItem value="packing">Packing Only</SelectItem>
                    <SelectItem value="storage">Storage Solutions</SelectItem>
                    <SelectItem value="office">Office Relocation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Moving Date</label>
                <Input
                  type="date"
                  className="bg-white/90 border-white/30 focus:border-primary text-black"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Property Size Field */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Property Size</label>
                <Select>
                  <SelectTrigger className="bg-white/90 border-white/30 focus:border-primary text-black">
                    <SelectValue placeholder="Select size..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio/Bedsitter</SelectItem>
                    <SelectItem value="1bed">1 Bedroom</SelectItem>
                    <SelectItem value="2bed">2 Bedrooms</SelectItem>
                    <SelectItem value="3bed">3 Bedrooms</SelectItem>
                    <SelectItem value="4bed">4+ Bedrooms</SelectItem>
                    <SelectItem value="office">Office Space</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch} variant="orange" className="h-12">
                <Search className="h-4 w-4 mr-2" />
                Get Quotes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Keeping this as is, as the request was about the search form design */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Our Moving Services</h2>
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <Truck className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Local Moves</h3>
                <p className="text-muted-foreground">
                  We handle local moves with efficiency and care, ensuring a smooth transition to your new home.
                </p>
              </CardContent>
            </Card>

            {/* Service Card 2 */}
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <Truck className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Long Distance Moves</h3>
                <p className="text-muted-foreground">
                  Relocating across the country? We provide reliable long-distance moving services.
                </p>
              </CardContent>
            </Card>

            {/* Service Card 3 */}
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <Truck className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Packing Services</h3>
                <p className="text-muted-foreground">
                  Let us handle the packing for you. We offer professional packing services for all your belongings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Moving Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Available Moving Services</h2>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage 
              message="Failed to load moving services. Please try again." 
              onRetry={() => refetch()}
            />
          ) : movingServices && movingServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {movingServices.map((service) => (
                <MovingServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No moving services found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Moving Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium ml-2">Verified Movers</span>
                </div>
                <p className="text-muted-foreground mb-4">All our moving partners are thoroughly vetted and verified for quality service.</p>
                <div className="font-semibold">Quality Assured</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium ml-2">Best Prices</span>
                </div>
                <p className="text-muted-foreground mb-4">Compare quotes from multiple movers to get the best deals for your move.</p>
                <div className="font-semibold">Competitive Rates</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium ml-2">Full Support</span>
                </div>
                <p className="text-muted-foreground mb-4">Get support throughout your moving process, from quote to completion.</p>
                <div className="font-semibold">24/7 Customer Care</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Movers;
