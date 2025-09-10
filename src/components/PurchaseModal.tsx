import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useCreatePurchase } from "@/hooks/usePurchases";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price: number;
    created_by: string;
  };
}

const PurchaseModal = ({ isOpen, onClose, item }: PurchaseModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const createPurchase = useCreatePurchase();

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please log in to make a purchase");
      onClose();
      return;
    }

    if (!name || !email || !phone || !address) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!item.created_by) {
      toast.error("Unable to process purchase - seller information missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPurchase.mutateAsync({
        item_id: item.id,
        seller_id: item.created_by,
        purchase_price: item.price,
        buyer_name: name,
        buyer_email: email,
        buyer_phone: phone,
        delivery_address: address,
      });
      toast.success("Purchase request submitted successfully!");
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to submit purchase. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase {item.title}</DialogTitle>
          <DialogDescription>
            Please fill in your details to purchase this item for KSh {item.price.toLocaleString()}.
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
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePurchase} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : `Buy for KSh ${item.price.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;