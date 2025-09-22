import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCreateBooking } from "@/hooks/useBookings";
import { format } from "date-fns";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
}

const BookingModal = ({ isOpen, onClose, propertyTitle, propertyId }: BookingModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const createBooking = useCreateBooking();

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please log in to book a property");
      onClose();
      return;
    }

    if (!name || !email || !phone || !bookingDate) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate date is not in the past
    const booking = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (booking < today) {
      toast.error("Booking date must be in the future");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking.mutateAsync({
        property: parseInt(propertyId),
        guest_name: name,
        guest_email: email,
        guest_phone: phone,
        booking_date: format(booking, 'yyyy-MM-dd'),
      });
      toast.success(`Booking request submitted successfully! Booking date: ${format(booking, 'MMM dd, yyyy')}`);
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setBookingDate("");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Don't show modal if not authenticated
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {propertyTitle}</DialogTitle>
          <DialogDescription>
            Please fill in your details to book this property.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingDate">Booking Date</Label>
            <Input
              id="bookingDate"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBooking} disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Book Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
