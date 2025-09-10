import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useMarketplaceItems } from "@/hooks/useMarketplace";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import PurchaseModal from "@/components/PurchaseModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Sofa, Laptop, Car, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import heroMarketplace from "@/assets/hero-marketplace.jpg";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = "Marketplace | Masskan Murima";
  }, []);

  const { data: marketplaceItems, isLoading, error, refetch } = useMarketplaceItems({
    search: searchTerm,
    category: selectedCategory === "all" ? "" : selectedCategory
  });

  if (isLoading) return <LoadingSpinner className="py-20" />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  const handleBuyNow = (item) => {
    if (!user) {
      toast.error("Please log in to make a purchase");
      return;
    }
    if (item.created_by === user.id) {
      toast.error("You cannot purchase your own item");
      return;
    }
    setSelectedItem(item);
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <PageHero 
        title="Household Items Marketplace"
        subtitle="Buy and sell furniture, electronics, and more with verified users."
        imageUrl={heroMarketplace}
      />

      <section className="py-16 -mt-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2 text-left md:col-span-2">
                <label className="text-sm font-medium text-white/80">Search Items</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search items (e.g., Sofa, TV)" 
                    className="pl-10 bg-white/90 border-white/30 focus:border-primary text-black rounded-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-sm font-medium text-white/80">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 bg-orange-500 hover:bg-orange-600">
                <Search className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={selectedCategory === "furniture" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("furniture")}
            >
              <Sofa className="h-4 w-4 mr-2" /> Furniture
            </Button>
            <Button 
              variant={selectedCategory === "electronics" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("electronics")}
            >
              <Laptop className="h-4 w-4 mr-2" /> Electronics
            </Button>
            <Button 
              variant={selectedCategory === "appliances" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("appliances")}
            >
              <Car className="h-4 w-4 mr-2" /> Appliances
            </Button>
            <Button 
              variant={selectedCategory === "home" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("home")}
            >
              <Package className="h-4 w-4 mr-2" /> Home & Garden
            </Button>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketplaceItems.map((item) => (
              <Card key={item.id} className="hover:shadow-card transition-all duration-300">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                  />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-foreground">
                    {item.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                  <div className="text-2xl font-bold text-primary mb-2">KSh {item.price.toLocaleString()}</div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                    <span>Condition: {item.condition}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location}
                  </div>
                  <Button size="sm" className="w-full" onClick={() => handleBuyNow(item)}>
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg">View All Items</Button>
          </div>
        </div>
      </section>

      {selectedItem && (
        <PurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          item={selectedItem}
        />
      )}

      <Footer />
    </div>
  );
};

export default Marketplace;
