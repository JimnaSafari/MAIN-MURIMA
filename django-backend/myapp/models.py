from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Profile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('user', 'User'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name or self.user.username

class Property(models.Model):
    PROPERTY_TYPES = [
        ('rental', 'Rental'),
        ('airbnb', 'Airbnb'),
        ('office', 'Office Space'),
    ]

    PRICE_TYPES = [
        ('month', 'Per Month'),
        ('night', 'Per Night'),
        ('sale', 'Sale Price'),
    ]

    RENTAL_TYPES = [
        ('single', 'Single Room'),
        ('bedsitter', 'Bedsitter'),
        ('one-bedroom', 'One Bedroom'),
        ('two-bedroom', 'Two Bedroom'),
        ('three-bedroom', 'Three Bedroom'),
        ('four-bedroom', 'Four Bedroom'),
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('studio', 'Studio'),
    ]

    MANAGED_BY_CHOICES = [
        ('landlord', 'Landlord'),
        ('agency', 'Agency'),
    ]

    # Basic Info
    title = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    county = models.CharField(max_length=100, blank=True, null=True)
    town = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    price_type = models.CharField(max_length=20, choices=PRICE_TYPES, default='month')
    type = models.CharField(max_length=20, choices=PROPERTY_TYPES, default='rental')

    # Property Details
    bedrooms = models.PositiveIntegerField(blank=True, null=True)
    bathrooms = models.PositiveIntegerField(blank=True, null=True)
    area = models.PositiveIntegerField(blank=True, null=True)  # in sq ft
    rental_type = models.CharField(max_length=20, choices=RENTAL_TYPES, blank=True, null=True)

    # Images (6 image fields for better admin control)
    image1 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Main Image")
    image2 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Image 2")
    image3 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Image 3")
    image4 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Image 4")
    image5 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Image 5")
    image6 = models.ImageField(upload_to='properties/', blank=True, null=True, verbose_name="Image 6")

    # Legacy field for backward compatibility
    image = models.ImageField(upload_to='properties/', blank=True, null=True)
    images = models.JSONField(blank=True, null=True)  # Array of image file paths

    # Ratings & Reviews
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(5)])
    reviews = models.PositiveIntegerField(default=0)

    # Management
    managed_by = models.CharField(max_length=20, choices=MANAGED_BY_CHOICES, blank=True, null=True)
    landlord_name = models.CharField(max_length=255, blank=True, null=True)
    landlord_verified = models.BooleanField(default=False)
    agency_name = models.CharField(max_length=255, blank=True, null=True)
    agency_verified = models.BooleanField(default=False)

    # Status
    featured = models.BooleanField(default=False)
    ready_date = models.DateField(blank=True, null=True, help_text="Date when property becomes ready for booking")

    # Amenities
    amenities = models.JSONField(blank=True, null=True, help_text="List of amenities available at the property")

    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        """Validate that at least 3 images are uploaded and no more than 6"""
        from django.core.exceptions import ValidationError

        # Count uploaded images
        image_fields = [self.image1, self.image2, self.image3, self.image4, self.image5, self.image6]
        uploaded_images = [img for img in image_fields if img]

        if len(uploaded_images) < 3:
            raise ValidationError("At least 3 images must be uploaded for each property.")

        if len(uploaded_images) > 6:
            raise ValidationError("Maximum 6 images can be uploaded for each property.")

    def save(self, *args, **kwargs):
        """Ensure validation is called before saving"""
        self.full_clean()  # This will call clean() method
        super().save(*args, **kwargs)

    def get_image_urls(self):
        """Get all uploaded image URLs"""
        image_urls = []
        request = None  # We'll handle this in the serializer

        for i in range(1, 7):
            image_field = getattr(self, f'image{i}')
            if image_field:
                if hasattr(image_field, 'url'):
                    image_urls.append(image_field.url)
                else:
                    image_urls.append(str(image_field))

        return image_urls

    def __str__(self):
        return self.title

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='bookings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Guest Info
    guest_name = models.CharField(max_length=255)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20)

    # Booking Details
    booking_date = models.DateField()
    check_in_date = models.DateField(blank=True, null=True)
    check_out_date = models.DateField(blank=True, null=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.guest_name} - {self.property.title}"

class MarketplaceItem(models.Model):
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('furniture', 'Furniture'),
        ('vehicles', 'Vehicles'),
        ('real_estate', 'Real Estate'),
        ('services', 'Services'),
        ('other', 'Other'),
    ]

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
        ('refurbished', 'Refurbished'),
    ]

    # Basic Info
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)

    # Details
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255)
    image = models.URLField()

    # Seller
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class MovingService(models.Model):
    # Basic Info
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    price_range = models.CharField(max_length=100)  # e.g., "KSh 5,000 - KSh 50,000"

    # Services Offered
    services = models.JSONField()  # Array of services

    # Images
    image = models.URLField()

    # Ratings
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(5)])
    reviews = models.PositiveIntegerField(default=0)

    # Verification
    verified = models.BooleanField(default=False)

    # Creator
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class MoverQuote(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('quoted', 'Quoted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    service = models.ForeignKey(MovingService, on_delete=models.CASCADE, related_name='quotes')

    # Client Info
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=20)

    # Moving Details
    pickup_location = models.CharField(max_length=255)
    delivery_location = models.CharField(max_length=255)
    moving_date = models.DateField()
    inventory = models.TextField(blank=True, null=True)

    # Quote
    quote_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, validators=[MinValueValidator(0)])

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client_name} - {self.service.name}"

class Review(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='property_reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['property', 'user']  # One review per user per property

    def __str__(self):
        return f"{self.user.username} - {self.property.title} - {self.rating} stars"

class Purchase(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    item = models.ForeignKey(MarketplaceItem, on_delete=models.CASCADE, related_name='purchases')

    # Buyer Info
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    buyer_name = models.CharField(max_length=255)
    buyer_email = models.EmailField()
    buyer_phone = models.CharField(max_length=20)

    # Seller
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')

    # Purchase Details
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    delivery_address = models.TextField(blank=True, null=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.buyer_name} - {self.item.title}"
