import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHero from "@/components/PageHero";
import heroMarketplace from "@/assets/hero-marketplace.jpg";
import { allCounties } from "@/data/locations";
import { useMarketplaceItems } from "@/hooks/useMarketplace";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    document.title = "Marketplace | Masskan Murima";
  }, []);

  // Use API hook with filters
  const filters = {
    ...(selectedCategory && selectedCategory !== "all" && { category: selectedCategory }),
    ...(selectedLocation && selectedLocation !== "any" && { location: selectedLocation }),
    ...(searchTerm && { search: searchTerm }),
  };

  const { data: marketplaceItems = [], isLoading, error } = useMarketplaceItems(filters);

  // Client-side filtering for additional search terms
  const filteredItems = Array.isArray(marketplaceItems)
    ? marketplaceItems.filter(item => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return item.title.toLowerCase().includes(searchLower) ||
               item.description?.toLowerCase().includes(searchLower) ||
               item.category.toLowerCase().includes(searchLower);
      })
    : [];

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
            {/* Professional Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
              {/* Search Input - Takes more space */}
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-white/80 mb-2">Search Items</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search furniture, electronics, appliances..."
                    className="pl-10 pr-4 py-3 bg-white/95 border-white/30 focus:border-blue-400 text-black rounded-xl text-sm placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-white/80 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 bg-white/95 border-white/30 text-black rounded-xl hover:bg-white focus:ring-2 focus:ring-blue-400/20 transition-all duration-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
                    <SelectItem value="furniture" className="rounded-lg">🏠 Furniture</SelectItem>
                    <SelectItem value="electronics" className="rounded-lg">💻 Electronics</SelectItem>
                    <SelectItem value="appliances" className="rounded-lg">🔌 Appliances</SelectItem>
                    <SelectItem value="home" className="rounded-lg">🏡 Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="w-full lg:w-44">
                <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 bg-white/95 border-white/30 text-black rounded-xl hover:bg-white focus:ring-2 focus:ring-blue-400/20 transition-all duration-200">
                    <SelectValue placeholder="Any Location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="any" className="rounded-lg">Any Location</SelectItem>
                    {allCounties.map((county) => (
                      <SelectItem key={county} value={county.toLowerCase()} className="rounded-lg">
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Button */}
              <div className="w-full lg:w-auto">
                <Button className="h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 w-full lg:w-auto border-0">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter ({filteredItems.length})
                </Button>
              </div>
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
              Furniture
            </Button>
            <Button
              variant={selectedCategory === "electronics" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("electronics")}
            >
              Electronics
            </Button>
            <Button
              variant={selectedCategory === "appliances" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("appliances")}
            >
              Appliances
            </Button>
            <Button
              variant={selectedCategory === "home" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("home")}
            >
              Home & Garden
            </Button>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12 bg-gradient-card">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading marketplace items...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">Error loading marketplace items. Please try again.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {filteredItems.map((item) => (
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
                      <Button size="sm" className="w-full" onClick={() => alert(`Buy ${item.title}`)}>
                        Buy Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredItems.length === 0 && marketplaceItems.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No items found matching your search criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSelectedLocation("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
              {marketplaceItems.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No marketplace items available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Be the first to list an item!</p>
                </div>
              )}
              <div className="text-center">
                <Button variant="outline" size="lg">View All Items</Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Marketplace;
