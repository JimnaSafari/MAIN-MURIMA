from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Property, Booking, MarketplaceItem, MovingService, MoverQuote, Purchase, Review
from django.db.models import Q

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email') or '',
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class PropertySerializer(serializers.ModelSerializer):
    # Image fields
    image1 = serializers.ImageField(required=False)
    image2 = serializers.ImageField(required=False)
    image3 = serializers.ImageField(required=False)
    image4 = serializers.ImageField(required=False)
    image5 = serializers.ImageField(required=False)
    image6 = serializers.ImageField(required=False)

    # Legacy fields for backward compatibility
    image = serializers.ImageField(required=False)
    images = serializers.JSONField(required=False)

    class Meta:
        model = Property
        fields = ['id', 'title', 'location', 'county', 'town', 'price', 'price_type', 'type', 'bedrooms', 'bathrooms', 'area', 'rental_type', 'image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image', 'images', 'rating', 'reviews', 'featured', 'managed_by', 'landlord_name', 'agency_name', 'ready_date', 'amenities', 'created_at']

    def to_representation(self, instance):
        """Convert image fields to URLs for API responses"""
        representation = super().to_representation(instance)

        request = self.context.get('request')

        # Convert all image fields to URLs
        image_urls = []
        for i in range(1, 7):
            image_field_name = f'image{i}'
            image_field = getattr(instance, image_field_name)
            if image_field:
                # Handle both Django ImageField objects and string paths
                if hasattr(image_field, 'url'):
                    # Django ImageField
                    if request:
                        url = request.build_absolute_uri(image_field.url)
                    else:
                        url = image_field.url
                else:
                    # Plain string path
                    if str(image_field).startswith('http'):
                        url = str(image_field)
                    elif request:
                        url = request.build_absolute_uri(str(image_field))
                    else:
                        url = str(image_field)
                representation[image_field_name] = url
                image_urls.append(url)

        # Populate legacy image field with first image (image1)
        if image_urls:
            representation['image'] = image_urls[0]
        else:
            representation['image'] = None

        # Populate images array with all uploaded images
        representation['images'] = image_urls

        # Handle legacy image field if it exists and no new images
        if not image_urls and instance.image:
            if hasattr(instance.image, 'url'):
                # Django ImageField
                if request:
                    legacy_image_url = request.build_absolute_uri(instance.image.url)
                else:
                    legacy_image_url = instance.image.url
            else:
                # Plain string path
                if str(instance.image).startswith('http'):
                    legacy_image_url = str(instance.image)
                elif request:
                    legacy_image_url = request.build_absolute_uri(str(instance.image))
                else:
                    legacy_image_url = str(instance.image)
            representation['image'] = legacy_image_url
            representation['images'] = [legacy_image_url]

        # Handle legacy images array if it exists and no new images
        if not image_urls and instance.images:
            images_urls = []
            for img_path in instance.images:
                if str(img_path).startswith('http'):
                    images_urls.append(str(img_path))
                elif request:
                    # If it's a relative path, convert to full URL
                    images_urls.append(request.build_absolute_uri(str(img_path)))
                else:
                    images_urls.append(str(img_path))
            representation['images'] = images_urls
            if not representation.get('image') and images_urls:
                representation['image'] = images_urls[0]

        return representation

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())

    class Meta:
        model = Booking
        fields = ['id', 'property', 'user', 'guest_name', 'guest_email', 'guest_phone', 'booking_date', 'check_in_date', 'check_out_date', 'status', 'created_at']

    def validate(self, data):
        # For booking requests, we only validate the booking_date
        # The check_in_date and check_out_date are optional and can be set later
        booking_date = data.get('booking_date')
        if booking_date:
            # Ensure booking date is not in the past
            from django.utils import timezone
            if booking_date < timezone.now().date():
                raise serializers.ValidationError("Booking date cannot be in the past")

        # Only validate overlapping if we have check_in and check_out dates
        property = data.get('property') or getattr(self.instance, 'property', None)
        start = data.get('check_in_date') or getattr(self.instance, 'check_in_date', None)
        end = data.get('check_out_date') or getattr(self.instance, 'check_out_date', None)

        if start and end:
            if start > end:
                raise serializers.ValidationError("check_out_date must be after check_in_date")

            # check overlapping bookings (inclusive)
            overlapping = Booking.objects.filter(property=property).filter(
                Q(check_in_date__lte=end) & Q(check_out_date__gte=start)
            )
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)
            if overlapping.exists():
                raise serializers.ValidationError("Property is already booked for those dates")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        # Ensure status is set to 'pending' for new bookings
        if 'status' not in validated_data:
            validated_data['status'] = 'pending'
        return super().create(validated_data)

class MarketplaceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketplaceItem
        fields = ['id', 'title', 'price', 'category', 'condition', 'description', 'location', 'image', 'created_by', 'created_at']

class MovingServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovingService
        fields = ['id', 'name', 'location', 'price_range', 'services', 'image', 'rating', 'reviews', 'verified', 'created_by', 'created_at']

class MoverQuoteSerializer(serializers.ModelSerializer):
    service = MovingServiceSerializer(read_only=True)

    class Meta:
        model = MoverQuote
        fields = ['id', 'service', 'user', 'client_name', 'client_email', 'client_phone', 'pickup_location', 'delivery_location', 'moving_date', 'inventory', 'quote_amount', 'status', 'created_at']

class PurchaseSerializer(serializers.ModelSerializer):
    item = MarketplaceItemSerializer(read_only=True)
    buyer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'item', 'buyer', 'buyer_name', 'buyer_email', 'buyer_phone', 'purchase_price', 'delivery_address', 'status', 'created_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    property = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'property', 'user', 'rating', 'comment', 'created_at']
