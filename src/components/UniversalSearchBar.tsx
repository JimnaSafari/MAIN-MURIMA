import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Home, Building, Truck, ShoppingCart, Calendar, X, Settings, User, FileText, Users, Phone, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { locationData, allCounties } from '@/data/locations';

interface UniversalSearchBarProps {
  className?: string;
}

// Comprehensive app functions and features
const appFunctions = [
  // Main Services
  { id: 'rentals', name: 'Property Rentals', icon: Home, path: '/rentals', description: 'Find rental properties', category: 'Properties' },
  { id: 'airbnb', name: 'Airbnb Stays', icon: Home, path: '/airbnb', description: 'Short-term accommodations', category: 'Properties' },
  { id: 'office', name: 'Office Spaces', icon: Building, path: '/office', description: 'Commercial office rentals', category: 'Properties' },
  { id: 'movers', name: 'Moving Services', icon: Truck, path: '/movers', description: 'Professional moving assistance', category: 'Services' },
  { id: 'marketplace', name: 'Marketplace', icon: ShoppingCart, path: '/marketplace', description: 'Buy and sell items', category: 'Services' },

  // User Functions
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3, path: '/dashboard', description: 'Your account overview', category: 'Account' },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile', description: 'Manage your profile', category: 'Account' },
  { id: 'bookings', name: 'My Bookings', icon: Calendar, path: '/dashboard', description: 'View your bookings', category: 'Account' },
  { id: 'quotes', name: 'Quotes', icon: FileText, path: '/quotes', description: 'Request and view quotes', category: 'Services' },

  // Admin Functions
  { id: 'admin', name: 'Admin Panel', icon: Settings, path: '/admin', description: 'Administrative functions', category: 'Admin' },
  { id: 'admin-dashboard', name: 'Admin Dashboard', icon: BarChart3, path: '/admin-dashboard', description: 'Admin analytics', category: 'Admin' },

  // Information Pages
  { id: 'about', name: 'About Us', icon: Users, path: '/about', description: 'Learn about our company', category: 'Info' },
  { id: 'contact', name: 'Contact Us', icon: Phone, path: '/contact', description: 'Get in touch with us', category: 'Info' },

  // Actions/Features
  { id: 'request-quote', name: 'Request Quote', icon: FileText, path: '/quotes', description: 'Get moving quotes', category: 'Actions' },
  { id: 'list-property', name: 'List Property', icon: Home, path: '/dashboard', description: 'List your property', category: 'Actions' },
  { id: 'find-movers', name: 'Find Movers', icon: Truck, path: '/movers', description: 'Locate moving services', category: 'Actions' },
];

const UniversalSearchBar = ({ className = "" }: UniversalSearchBarProps) => {
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (service) params.append('service', service);
    if (date) params.append('date', date);

    // Navigate based on service selection
    let targetPath = '/';

    switch (service) {
      case 'rentals':
        targetPath = `/rentals?${params.toString()}`;
        break;
      case 'airbnb':
        targetPath = `/airbnb?${params.toString()}`;
        break;
      case 'office':
        targetPath = `/office?${params.toString()}`;
        break;
      case 'movers':
        targetPath = `/movers?${params.toString()}`;
        break;
      case 'marketplace':
        targetPath = `/marketplace?${params.toString()}`;
        break;
      default:
        targetPath = `/?${params.toString()}`;
    }

    navigate(targetPath);
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/20 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Location Button */}
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 z-10" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="pl-10 bg-white border-gray-300 text-gray-900 h-10 rounded-lg">
              <SelectValue placeholder="Location" />
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

        {/* Service Button */}
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-10 rounded-lg">
            <SelectValue placeholder="Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rentals">Property Rentals</SelectItem>
            <SelectItem value="airbnb">Airbnb Stays</SelectItem>
            <SelectItem value="office">Office Spaces</SelectItem>
            <SelectItem value="movers">Moving Services</SelectItem>
            <SelectItem value="marketplace">Marketplace</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Field */}
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 z-10" />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900 h-10 rounded-lg"
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          variant="orange"
          className="h-10 px-6"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default UniversalSearchBar;
