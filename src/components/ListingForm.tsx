import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useCreateProperty } from '@/hooks/useListings';
import { useCreateMarketplaceItem } from '@/hooks/useListings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { locationData, allCounties } from '@/data/locations';

interface ListingFormProps {
  type: 'property' | 'marketplace';
}

const ListingForm = ({ type }: ListingFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const bucket = type === 'property' ? 'property-images' : 'marketplace-images';
  const { uploadImage, uploading } = useImageUpload(bucket);
  const createProperty = useCreateProperty();
  const createMarketplaceItem = useCreateMarketplaceItem();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...images, ...files].slice(0, 6); // Maximum 6 images
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImages(newImages);
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to create a listing");
      return;
    }

    if (images.length < 3) {
      toast.error("Please upload at least 3 images");
      return;
    }

    // Validate required county and town fields
    if (!formData.county) {
      toast.error("Please select a county");
      return;
    }

    if (!formData.town || formData.town.trim() === '') {
      toast.error("Please enter a town name");
      return;
    }

    try {
      // Upload all images
      const imageUrls = await Promise.all(
        images.map(image => uploadImage(image))
      );
      const primaryImageUrl = imageUrls[0];

      // Prepare listing data with all supported fields
      const listingData = {
        ...formData,
        image: primaryImageUrl,
        images: imageUrls, // Store all image URLs
      };

      if (type === 'property') {
        await createProperty.mutateAsync(listingData);
        toast.success("Property listed successfully!");
      } else {
        await createMarketplaceItem.mutateAsync(listingData);
        toast.success("Item listed successfully!");
      }

      setIsOpen(false);
      setFormData({});
      setImages([]);
      setImagePreviews([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          List {type === 'property' ? 'Property' : 'Item'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New {type === 'property' ? 'Property' : 'Marketplace'} Listing</DialogTitle>
          <DialogDescription>
            Fill in the details to create your listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Multiple Image Upload */}
          <div className="space-y-2">
            <Label>Property Images (At least 3 required)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors h-32 flex flex-col justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Add Image</p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Upload {images.length}/6 images (minimum 3 required)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          {/* County and Town Selection (Required) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="county">County *</Label>
              <Select
                value={formData.county || ''}
                onValueChange={(value) => setFormData({...formData, county: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select County" />
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
            <div className="space-y-2">
              <Label htmlFor="town">Town *</Label>
              <Input
                id="town"
                value={formData.town || ''}
                onChange={(e) => setFormData({...formData, town: e.target.value.trim()})}
                placeholder="Enter town name (e.g., Nairobi, Mombasa)"
                required
                disabled={!formData.county}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (KSh)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
              required
            />
          </div>

          {type === 'property' ? (
            <>
              {/* Rental Type Selection - Only show for non-office properties */}
              {formData.type !== 'office' && (
                <div className="space-y-2">
                  <Label htmlFor="rental_type">Rental Type</Label>
                  <Select
                    value={formData.rental_type || ''}
                    onValueChange={(value) => setFormData({...formData, rental_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rental type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Room</SelectItem>
                      <SelectItem value="bedsitter">Bedsitter</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="one-bedroom">One Bedroom</SelectItem>
                      <SelectItem value="two-bedroom">Two Bedroom</SelectItem>
                      <SelectItem value="three-bedroom">Three Bedroom</SelectItem>
                      <SelectItem value="four-bedroom">Four Bedroom</SelectItem>
                      <SelectItem value="five-bedroom">Five Bedroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Conditionally show bedrooms and bathrooms based on rental type */}
              {formData.rental_type && !['single', 'bedsitter', 'studio'].includes(formData.rental_type) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms || ''}
                      onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms || ''}
                      onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area || ''}
                  onChange={(e) => setFormData({...formData, area: parseInt(e.target.value)})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rental">Rental</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="office">Office Space</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_type">Price Type</Label>
                  <Select value={formData.price_type} onValueChange={(value) => setFormData({...formData, price_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Per Month</SelectItem>
                      <SelectItem value="night">Per Night</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Managed By Selection */}
              <div className="space-y-2">
                <Label htmlFor="managed_by">Managed By</Label>
                <Select value={formData.managed_by} onValueChange={(value) => setFormData({...formData, managed_by: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landlord">Landlord</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading || createProperty.isPending || createMarketplaceItem.isPending || (type === 'property' && images.length < 3)}
            >
              {uploading || createProperty.isPending || createMarketplaceItem.isPending ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ListingForm;
