import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Shield, Award, Star, MapPin, Heart } from "lucide-react";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About Us | Masskan Rima";
  }, []);

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the safety and security of all our clients with verified listings and secure transactions."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building strong communities by connecting people with quality homes and services across Kenya."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing exceptional service and maintaining the highest standards in everything we do."
    },
    {
      icon: CheckCircle,
      title: "Reliability",
      description: "Dependable platform with transparent processes and responsive customer support when you need it."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "5,000+", label: "Properties Listed" },
    { number: "50+", label: "Cities Covered" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Similar to Homepage */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-blue-900">
        <div className="absolute inset-0 bg-[url('/hero-properties.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight animate-fade-in-up text-white">
            About Masskan Rima
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 animate-fade-in-up delay-200">
            Your trusted partner for property rentals, moving services, and marketplace solutions across Kenya.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&auto=format&fit=crop"
                alt="Our Story"
                className="rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:order-1 text-center lg:text-left">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Story</h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Founded with a vision to simplify property rentals and moving services in Kenya,
                Masskan Rima has grown to become a trusted platform connecting thousands of
                property seekers with quality homes and reliable service providers.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                We understand the challenges of finding the perfect home or office space,
                which is why we've created a comprehensive platform that brings together
                rentals, Airbnb stays, office spaces, moving services, and a marketplace
                for buying and selling items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced with more visual appeal */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-orange-500 hover:border-l-8">
                <div className="absolute inset-0 bg-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="relative p-8 text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <value.icon className="h-10 w-10 text-blue-900 group-hover:text-orange-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-900 transition-colors duration-300">{value.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact/Stats Section - Reordered and styled */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Our Impact</h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Numbers that speak to our commitment to excellence and customer satisfaction
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-orange-400/30 hover:border-orange-500/50">
                  <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Retained and slightly adjusted */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">Meet Our Team</h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Passionate professionals dedicated to transforming the property and services landscape in Kenya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/ceo.jpg" alt="CEO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-blue-900">CEO Name</h3>
                <p className="text-slate-700 mb-4">Chief Executive Officer</p>
              </CardContent>
            </Card>
            <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/cfo.jpg" alt="CFO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-blue-900">CFO Name</h3>
                <p className="text-slate-700 mb-4">Chief Financial Officer</p>
              </CardContent>
            </Card>
            <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/coo.jpg" alt="COO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-blue-900">COO Name</h3>
                <p className="text-slate-700 mb-4">Chief Operating Officer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Retained and slightly adjusted */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Real experiences from satisfied customers who found their perfect homes through Masskan Rima
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "Masskan Rima made finding my apartment in Nairobi so easy! The platform is user-friendly and the listings are verified. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-900/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Sarah Wanjiku</p>
                    <p className="text-sm text-slate-700">Nairobi Resident</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "The moving services were exceptional. Professional movers, great pricing, and everything was handled smoothly. Will definitely use again!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-900/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">David Kiprop</p>
                    <p className="text-sm text-slate-700">Recent Mover</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">
                  "Found my office space in Westlands within days. The platform connects you with verified properties and the support team is amazing!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-900/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Grace Achieng</p>
                    <p className="text-sm text-slate-700">Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section - Retained and slightly adjusted */}
      <section className="py-20 bg-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Our Mission
            </h2>
            <p className="text-2xl text-white leading-relaxed mb-8">
              To revolutionize the way people find homes, offices, and services in Kenya
              by providing a reliable, transparent, and user-friendly platform that
              connects communities and empowers both property owners and seekers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 rounded-full px-8 py-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <span className="font-semibold text-white">Innovation</span>
              </div>
              <div className="bg-white/10 rounded-full px-8 py-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <span className="font-semibold text-white">Trust</span>
              </div>
              <div className="bg-white/10 rounded-full px-8 py-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <span className="font-semibold text-white">Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
