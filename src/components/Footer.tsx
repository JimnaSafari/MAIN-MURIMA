import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <Home className="h-5 w-5 text-secondary-foreground" />
              </div>
              <span className="text-xl font-bold">Masskan Murima</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Your trusted platform for property rentals, short-term stays, moving services, and marketplace transactions.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-secondary">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/rentals" className="text-primary-foreground/80 hover:text-secondary transition-colors">House Rentals</a></li>
              <li><a href="/airbnb" className="text-primary-foreground/80 hover:text-secondary transition-colors">Airbnb Stays</a></li>
              <li><a href="/movers" className="text-primary-foreground/80 hover:text-secondary transition-colors">Moving Services</a></li>
              <li><a href="/marketplace" className="text-primary-foreground/80 hover:text-secondary transition-colors">Marketplace</a></li>
              <li><a href="/about" className="text-primary-foreground/80 hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Property Management</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Virtual Tours</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Moving Quotes</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">Secure Payments</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">24/7 Support</a></li>
              
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-primary-foreground/80 mb-4">
              Subscribe to get the latest properties and offers.
            </p>
            <div className="space-y-3">
              <Input placeholder="Enter your email" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60" />
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Subscribe
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span className="text-sm">info@masskanmurima.com</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span className="text-sm">0731971838</span>
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Masskan Murima. All rights reserved. Developed by Palsa Developers
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm">Terms of Service</a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary text-sm">Cookie Policy</a>
              <a href="/admin-login" className="text-primary-foreground/60 hover:text-secondary text-sm">Admin Portal</a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;