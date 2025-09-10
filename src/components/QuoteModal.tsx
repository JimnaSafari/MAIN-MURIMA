import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateQuote } from '@/hooks/useQuotes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
}

const QuoteModal = ({ isOpen, onClose, serviceId, serviceName }: QuoteModalProps) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [movingDate, setMovingDate] = useState('');
  const [inventory, setInventory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const { mutate: createQuote } = useCreateQuote();

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to request a quote');
      return;
    }

    if (!clientName || !clientEmail || !clientPhone || !pickupLocation || !deliveryLocation || !movingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    createQuote({
      service_id: serviceId,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      pickup_location: pickupLocation,
      delivery_location: deliveryLocation,
      moving_date: movingDate,
      inventory,
    }, {
      onSuccess: () => {
        toast.success('Quote request submitted successfully!');
        onClose();
        // Reset form
        setClientName('');
        setClientEmail('');
        setClientPhone('');
        setPickupLocation('');
        setDeliveryLocation('');
        setMovingDate('');
        setInventory('');
      },
      onError: (error: any) => {
        toast.error('Failed to submit quote request. Please try again.');
        console.error('Quote submission error:', error);
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Quote</DialogTitle>
          <DialogDescription>
            Get a quote for {serviceName}. Fill in your details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="clientName">Full Name *</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientEmail">Email *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientPhone">Phone Number *</Label>
            <Input
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickupLocation">Pickup Location *</Label>
            <Input
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Where are you moving from?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deliveryLocation">Delivery Location *</Label>
            <Input
              id="deliveryLocation"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Where are you moving to?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="movingDate">Moving Date *</Label>
            <Input
              id="movingDate"
              type="date"
              value={movingDate}
              onChange={(e) => setMovingDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inventory">Inventory (Optional)</Label>
            <Textarea
              id="inventory"
              value={inventory}
              onChange={(e) => setInventory(e.target.value)}
              placeholder="Describe what you're moving (furniture, boxes, etc.)"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Request Quote'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;