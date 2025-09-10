import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateQuote } from '@/hooks/useQuotes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MapPin, Calendar, Phone, Mail, User } from 'lucide-react';

interface SimpleQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
}

const SimpleQuoteModal = ({ isOpen, onClose, serviceId, serviceName }: SimpleQuoteModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { mutate: createQuote } = useCreateQuote();

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to request a quote');
      return;
    }

    if (!name || !email || !phone || !fromLocation || !toLocation || !date) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    createQuote({
      service_id: serviceId,
      client_name: name,
      client_email: email,
      client_phone: phone,
      pickup_location: fromLocation,
      delivery_location: toLocation,
      moving_date: date,
      inventory: '',
    }, {
      onSuccess: () => {
        toast.success('Quote request sent! We\'ll contact you soon.');
        onClose();
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setFromLocation('');
        setToLocation('');
        setDate('');
      },
      onError: (error: any) => {
        toast.error('Failed to send quote request. Please try again.');
        console.error('Quote submission error:', error);
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Get Quote - {serviceName}
          </DialogTitle>
          <DialogDescription>
            Quick quote request. We'll contact you within 24 hours with pricing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                From
              </Label>
              <Input
                id="from"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Current location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                To
              </Label>
              <Input
                id="to"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="New location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Moving Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
            {isSubmitting ? 'Sending...' : 'Get Quote'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleQuoteModal;