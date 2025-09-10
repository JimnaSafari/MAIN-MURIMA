import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home, Calendar } from "lucide-react";

const Hero = ({ children }: { children?: React.ReactNode }) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-properties.jpg"
          alt="Beautiful properties in Masskan Murima"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div> {/* Darker overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-secondary to-orange-300 bg-clip-text text-transparent">
              Home & Services
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Discover amazing properties, book short-term stays, find reliable movers, and explore our marketplace - all in one platform.
          </p>

          {/* Universal Search Bar */}
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
