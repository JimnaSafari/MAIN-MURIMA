import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Users, HeadphonesIcon, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | Masskan Rima";
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [{
    icon: Phone,
    title: "Phone",
    details: ["0731971838", "0796720095"],
    description: "Call us Monday to Friday, 8AM - 6PM"
  }, {
    icon: Mail,
    title: "Email",
    details: ["info@masskanrima.com", "support@masskanrima.com"],
    description: "We'll respond within 24 hours"
  }, {
    icon: MapPin,
    title: "Office",
    details: ["Westlands, Nairobi", "Kenya"],
    description: "Visit us for in-person consultations"
  }, {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 8AM - 6PM", "Sat: 9AM - 4PM"],
    description: "Sunday: Closed"
  }];

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: MessageSquare, value: "24/7", label: "Support Available" },
    { icon: HeadphonesIcon, value: "< 2hrs", label: "Response Time" },
    { icon: Send, value: "99%", label: "Satisfaction Rate" }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond within 2 hours during business hours and within 24 hours on weekends."
    },
    {
      question: "Do you offer virtual consultations?",
      answer: "Yes! We provide virtual consultations via video call, phone, or email for your convenience."
    },
    {
      question: "What areas do you serve?",
      answer: "We serve the entire Nairobi metropolitan area and surrounding regions in Kenya."
    },
    {
      question: "Can I schedule an in-person meeting?",
      answer: "Absolutely! Visit our Westlands office or schedule a meeting at a location convenient for you."
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Similar to Homepage */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-blue-900">
        <div className="absolute inset-0 bg-[url('/public/hero-properties.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-blue-900/70"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight animate-fade-in-up text-white">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 animate-fade-in-up delay-200">
            Ready to find your perfect home or service? Our expert team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">Reach Out to Us</h2>
                <p className="text-lg text-slate-700">
                  Choose the best way to reach us. We're available through multiple channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <info.icon className="h-6 w-6 text-blue-900" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 text-blue-900">{info.title}</h3>
                          <div className="space-y-1 mb-3">
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-slate-700 font-medium">
                                {detail}
                              </p>
                            ))}
                          </div>
                          <p className="text-sm text-slate-600">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Media Links */}
              <Card className="border-0 bg-orange-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-blue-900">Follow Us</h3>
                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <button
                        key={index}
                        onClick={() => toast.info(`Opening ${social.label}...`)}
                        className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5 text-blue-900" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl font-bold text-blue-900 mb-4">Send us a Message</h2>
                <p className="text-lg text-slate-700">
                  Have questions about our services? Fill out the form below and we'll get back to you soon.
                </p>
              </div>

              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-blue-900">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Your full name"
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-blue-900">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="your.email@example.com"
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-blue-900">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0731971838"
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 text-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-blue-900">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="How can we help?"
                          className="h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-blue-900">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500/20 resize-none text-slate-900"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-900 relative overflow-hidden">
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
                    {stat.value}
                  </div>
                  <div className="text-white font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Find quick answers to common questions about our services and how we can help you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-900">{faq.question}</h3>
                  <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900">Find Our Office</h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto">
              Visit us at our Westlands office for personalized consultations and property viewings.
            </p>
          </div>

          <Card className="overflow-hidden shadow-xl border-0">
            <div className="aspect-video bg-blue-900/10 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-900 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Westlands Office</h3>
                <p className="text-slate-700 mb-4">Nairobi, Kenya</p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    window.open('https://www.google.com/maps/search/?api=1&query=Westlands+Nairobi+Kenya', '_blank');
                  }}
                >
                  Get Directions
                </Button>
              </div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop')] bg-cover bg-center opacity-10"></div>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 text-white">
            Contact us today and let our experts help you find your perfect property or service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-900 hover:bg-gray-100"
              onClick={() => window.location.href = 'tel:0731971838'}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: 0731971838
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={() => window.location.href = 'mailto:info@masskanrima.com'}
            >
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
