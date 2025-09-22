import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProperty, useDeleteProperty } from '@/hooks/useListings';
import {
  MapPin,
  Star,
  Bed,
  Bath,
  Square,
  Calendar,
  School,
  Hospital,
  ShoppingCart,
  Route,
  Shield,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Loader2
} from 'lucide-react';
import BookingModal from './BookingModal';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const PropertyDetailsModal = ({ isOpen, onClose, property }: PropertyDetailsModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [expectedBookingDate, setExpectedBookingDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: property?.title || '',
    description: property?.description || '',
    price: property?.price || 0,
    location: property?.location || '',
  });

  // Booking availability data using ready_date from backend
  const getBookingStatus = (property: any) => {
    // Office and bedsitter properties are always available for booking
    if (property?.type === 'office' || property?.type === 'bedsitter' || property?.rental_type === 'bedsitter') {
      return {
        isAvailable: true,
        availabilityDate: new Date().toLocaleDateString(),
        statusText: 'Ready for booking'
      };
    }

    // Use ready_date from backend, fallback to current date if not available
    const readyDate = property?.ready_date ? new Date(property.ready_date) : new Date();
    const today = new Date();

    // If user has selected an expected booking date, check if it matches or is after ready_date
    if (expectedBookingDate) {
      const selectedDate = new Date(expectedBookingDate);

      // If selected date is on or after ready_date, property is available for booking
      if (selectedDate >= readyDate) {
        return {
          isAvailable: true,
          availabilityDate: readyDate.toLocaleDateString(),
          statusText: 'Ready for booking'
        };
      } else {
        return {
          isAvailable: false,
          availabilityDate: readyDate.toLocaleDateString(),
          statusText: `Property available from ${readyDate.toLocaleDateString()}`
        };
      }
    }

    // Default logic if no expected booking date is selected
    const isAvailable = readyDate <= today;
    return {
      isAvailable,
      availabilityDate: readyDate.toLocaleDateString(),
      statusText: isAvailable ? 'Ready for booking' : `Will be ready for booking on ${readyDate.toLocaleDateString()}`
    };
  };

  // Use useMemo to recalculate booking status when expectedBookingDate changes
  const bookingStatus = useMemo(() => getBookingStatus(property), [property, expectedBookingDate]);

  // Mock amenities data based on location
  const getAmenities = (location: string) => {
    const locationLower = location.toLowerCase();

    if (locationLower.includes('kilimani')) {
      return {
        schools: ['Kilimani Primary School', 'Nairobi Academy', 'Westlands International School'],
        hospitals: ['Nairobi Hospital', 'Kilimani Medical Centre', 'Aga Khan Hospital'],
        markets: ['Kilimani Market', 'Sarit Centre', 'Westlands Mall'],
        roads: ['Mombasa Road', 'Langata Road', 'Ngong Road']
      };
    } else if (locationLower.includes('chuka')) {
      return {
        schools: ['Chuka Boys High School', 'Chuka Girls High School', 'Meru University'],
        hospitals: ['Chuka District Hospital', 'Meru Level 5 Hospital'],
        markets: ['Chuka Main Market', 'Meru Central Market'],
        roads: ['Nairobi-Meru Highway', 'Chuka-Embu Road']
      };
    } else if (locationLower.includes('meru')) {
      return {
        schools: ['Meru School', 'Kaaga Girls High School', 'Meru University'],
        hospitals: ['Meru Level 5 Hospital', 'Meru Teaching and Referral Hospital'],
        markets: ['Meru Central Market', 'Town Centre Market'],
        roads: ['Nairobi-Meru Highway', 'Meru-Nanyuki Road']
      };
    }

    // Default amenities
    return {
      schools: ['Local Primary School', 'Nearby Secondary School'],
      hospitals: ['District Hospital', 'Medical Centre'],
      markets: ['Local Market', 'Shopping Centre'],
      roads: ['Main Highway', 'Access Road']
    };
  };

  const amenities = getAmenities(property?.location || '');

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book this property",
        variant: "destructive",
      });
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!property?.id) return;

    try {
      await updateProperty.mutateAsync({
        id: property.id,
        data: editForm
      });
      toast({
        title: "Success",
        description: "Property details updated successfully",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!property?.id) return;

    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteProperty.mutateAsync(property.id);
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const isAdmin = false; // TODO: Implement proper admin role checking

  if (!property) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              {property.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Display all uploaded images (image1 to image6) */}
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const imageUrl = property[`image${num}`];
                if (imageUrl) {
                  return (
                    <img
                      key={num}
                      src={imageUrl}
                      alt={`${property.title} - Image ${num}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  );
                }
                return null;
              }).filter(Boolean)}

              {/* Fallback to legacy images if no new images uploaded */}
              {(!property.image1 && !property.image2 && !property.image3 &&
                !property.image4 && !property.image5 && !property.image6) && (
                <>
                  {property.images && property.images.length > 0 ? (
                    property.images.slice(0, 6).map((image: string, index: number) => (
                      <img
                        key={`legacy-${index}`}
                        src={image}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-lg md:col-span-2"
                    />
                  )}
                </>
              )}
            </div>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Property Details</span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        disabled={updateProperty.isPending || deleteProperty.isPending}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={updateProperty.isPending || deleteProperty.isPending}
                      >
                        {deleteProperty.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (KSh)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleEditSave} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-5 w-5 text-muted-foreground" />
                      <span>{property.area} sqft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>{property.rating} ({property.reviews} reviews)</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      KSh {property.price.toLocaleString()}
                      <span className="text-sm text-muted-foreground ml-1">
                        /{property.priceType || property.price_type || (property.type === "Airbnb" ? "night" : "month")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                  </div>
                  <Badge variant={property.featured ? "default" : "secondary"}>
                    {property.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Location & Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-muted-foreground">{property.location}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">County/Town</h4>
                    <p className="text-muted-foreground">
                      {property.location.split(',')[1]?.trim() || 'Nairobi County'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Property Type</h4>
                    <p className="text-muted-foreground capitalize">{property.type}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Nearby Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <School className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold">Schools</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {amenities.schools.map((school, index) => (
                        <li key={index}>• {school}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Hospital className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">Hospitals</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {amenities.hospitals.map((hospital, index) => (
                        <li key={index}>• {hospital}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4 text-green-500" />
                      <span className="font-semibold">Markets</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {amenities.markets.map((market, index) => (
                        <li key={index}>• {market}</li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold">Roads</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {amenities.roads.map((road, index) => (
                        <li key={index}>• {road}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expected Booking Date - Hide for office properties */}
            {property.type !== 'office' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Expected Booking Date (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="booking-date">Select your preferred booking date</Label>
                      <Input
                        id="booking-date"
                        type="date"
                        value={expectedBookingDate}
                        onChange={(e) => setExpectedBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-2"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This helps us prepare the property for your arrival. You can change this later.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Manager Information - Hide for office properties */}
            {property.type !== 'office' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Property Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Managed by {property.managed_by === 'Agency' ? 'an Agency' : 'Landlord'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Functions */}
            {isAdmin && (
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Shield className="h-5 w-5" />
                    Admin Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Property
                    </Button>
                    <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as Pending
                    </Button>
                    <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Update Pricing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-4">
            {/* Booking Status */}
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 rounded-lg w-full">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{bookingStatus.statusText}</span>
            </div>

            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button
                onClick={handleBookNow}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={!bookingStatus.isAvailable}
              >
                {bookingStatus.isAvailable ? 'Book Now' : 'Not Available Yet'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          propertyTitle={property.title}
          propertyId={property.id || ''}
        />
      )}
    </>
  );
};

export default PropertyDetailsModal;
