import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Truck, ShoppingCart, Shield, Star, Clock, Users } from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Building,
      title: "House Rentals",
      description: "Find long-term rental properties with detailed information, virtual tours, and verified landlords.",
      features: ["3D Virtual Tours", "Rental Calculator", "Verified Properties", "Direct Contact"]
    },
    {
      icon: MapPin,
      title: "Airbnb Stays",
      description: "Book short-term accommodations with instant booking and secure payments.",
      features: ["Instant Booking", "Host Reviews", "Secure Payments", "24/7 Support"]
    },
    {
      icon: Truck,
      title: "Movers & Marketplace",
      description: "Professional moving services and buy/sell household items safely.",
      features: ["Moving Quotes", "Item Marketplace", "Verified Services", "Secure Transactions"]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "All properties and services are verified for your safety and peace of mind."
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "Browse highly rated properties and services with genuine user reviews."
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get instant responses and book properties or services in real-time."
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join a community of verified hosts, tenants, and service providers."
    }
  ];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        {/* Main Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From finding your dream home to moving services and marketplace - we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-card transition-all duration-300 animate-fade-in border-0 bg-card/50 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-primary" size="lg">
                  Explore {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center p-6 border-0 bg-white/50 backdrop-blur hover:shadow-card transition-all duration-300">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <benefit.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;