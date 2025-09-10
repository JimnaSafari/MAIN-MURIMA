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

// Mock data for properties (from Rentals.tsx, not directly used here but for context)
// const mockProperties = [...] 

// Mock data for moving service examples
const movingServiceExamples = [
  {
    id: "m1",
    serviceType: "Local Move",
    origin: "Nairobi CBD",
    destination: "Westlands",
    date: "2025-08-20",
    price: "KSh 15,000",
    moverName: "Shophus Movers", // Added mover name
    testimonial: "Seamless local move! Shophus Movers was efficient and careful with all our belongings.",
    rating: 4.8,
    image: "/hero-movers.png", // Placeholder image
  },
  {
    id: "m2",
    serviceType: "Long Distance Move",
    origin: "Mombasa",
    destination: "Nairobi",
    date: "2025-09-01",
    price: "KSh 50,000",
    moverName: "Rinal Movers", // Added mover name
    testimonial: "Great service for our cross-country move. Rinal Movers is highly recommended!",
    rating: 4.5,
    image: "/hero-movers.png", // Placeholder image
  },
  {
    id: "m3",
    serviceType: "Packing Services",
    origin: "Karen",
    destination: "Runda",
    date: "2025-08-25",
    price: "KSh 8,000",
    moverName: "Greencab Movers", // Added mover name
    testimonial: "Professional packing that saved us so much time and hassle. Greencab Movers did an excellent job.",
    rating: 4.7,
    image: "/hero-movers.png", // Placeholder image
  },
];

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
            {/* Using the styling from Rentals.tsx for the search form container */}
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20 animate-slide-up">
            {/* Using the grid layout from Rentals.tsx */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"> 
              
              {/* Location Field (similar to County in Rentals.tsx) */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Service Type Field (similar to Property Type in Rentals.tsx) */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Service Type</label>
                <Select 
                  value={serviceType} 
                  onValueChange={setServiceType}
                >
                  <SelectTrigger>
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Move</SelectItem>
                    <SelectItem value="long-distance">Long Distance Move</SelectItem>
                    <SelectItem value="packing">Packing Services</SelectItem>
                    <SelectItem value="storage">Storage Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Field (new, similar to Price Range in Rentals.tsx) */}
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Date</label>
                <Select 
                  value={moveDate} 
                  onValueChange={setMoveDate}
                >
                  <SelectTrigger>
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select date..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Placeholder date options */}
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button - styled like Rentals.tsx */}
              <Button onClick={handleSearch} className="h-12 bg-orange-500 hover:bg-orange-600">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Customer Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {movingServiceExamples.map((example) => (
              <Card key={example.id} className="text-center border-0 bg-card/80 backdrop-blur shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium ml-2">{example.rating}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">"{example.testimonial}"</p>
                  <div className="font-semibold">{example.moverName}</div>
                  <div className="text-sm text-muted-foreground">{example.serviceType}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Movers;
