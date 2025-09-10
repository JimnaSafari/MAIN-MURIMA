import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import UniversalSearchBar from '@/components/UniversalSearchBar';
import { useSearchProperties } from '@/hooks/useSearch';
import { useState } from 'react';

const Index = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const { data: searchResults } = useSearchProperties(searchFilters);

  const handleSearch = (filters: any) => {
    const searchFilters = {
      location: filters.location || undefined,
      type: filters.type || undefined,
      priceMin: undefined,
      priceMax: undefined,
      bedrooms: undefined,
      bathrooms: undefined
    };
    setSearchFilters(searchFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero>
        <UniversalSearchBar />
      </Hero>
      <Features />
      <FeaturedProperties searchResults={searchResults} />
      <Footer />
    </div>
  );
};

export default Index;
