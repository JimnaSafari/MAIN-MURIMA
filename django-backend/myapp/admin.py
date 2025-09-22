from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.admin.widgets import AdminTextInputWidget
from django.forms import Textarea, TextInput, ModelForm
from django import forms
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.shortcuts import redirect, get_object_or_404
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import json
import uuid
import os
from .models import Property, Booking, MarketplaceItem, MovingService, MoverQuote, Purchase, Profile, Review

# Custom form for Property admin
class PropertyAdminForm(ModelForm):
    class Meta:
        model = Property
        fields = '__all__'
        widgets = {
            'amenities': Textarea(attrs={
                'rows': 10,
                'cols': 80,
                'placeholder': 'Enter amenities as JSON format:\n{\n  "schools": ["School Name 1", "School Name 2"],\n  "hospitals": ["Hospital Name 1"],\n  "markets": ["Market Name 1"],\n  "roads": ["Road Name 1"]\n}'
            }),
            'images': Textarea(attrs={
                'rows': 5,
                'cols': 80,
                'placeholder': 'Enter image URLs as JSON array:\n["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Format amenities for display
        if self.instance and self.instance.amenities:
            self.fields['amenities'].initial = json.dumps(self.instance.amenities, indent=2)

    def clean(self):
        cleaned_data = super().clean()
        # Validate minimum 3 images
        image_fields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6']
        uploaded_images = [cleaned_data.get(field) for field in image_fields if cleaned_data.get(field)]

        if len(uploaded_images) < 3:
            raise forms.ValidationError("At least 3 images must be uploaded for each property.")

        if len(uploaded_images) > 6:
            raise forms.ValidationError("Maximum 6 images can be uploaded for each property.")

        return cleaned_data

    def clean_amenities(self):
        amenities = self.cleaned_data.get('amenities')
        if isinstance(amenities, str):
            try:
                return json.loads(amenities)
            except json.JSONDecodeError:
                raise forms.ValidationError("Invalid JSON format for amenities")
        return amenities

# Register your models here.

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    form = PropertyAdminForm
    list_display = ('title', 'location', 'county', 'town', 'price_display', 'type', 'rental_type', 'featured', 'created_at')
    list_filter = ('type', 'price_type', 'rental_type', 'managed_by', 'featured', 'county', 'town', 'created_at')
    search_fields = ('title', 'location', 'county', 'town', 'landlord_name', 'agency_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'image_preview')

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'location', 'county', 'town', 'price', 'price_type', 'type')
        }),
        ('Property Details', {
            'fields': ('bedrooms', 'bathrooms', 'area', 'rental_type')
        }),
        ('Images (Upload 3-6 images)', {
            'fields': ('image1', 'image2', 'image3', 'image4', 'image5', 'image6'),
            'description': 'Upload between 3 to 6 images for this property. All fields are required.',
            'classes': ('collapse',)
        }),
        ('Legacy Images', {
            'fields': ('image', 'images', 'image_preview'),
            'classes': ('collapse',)
        }),
        ('Amenities', {
            'fields': ('amenities',),
            'classes': ('collapse',)
        }),
        ('Ratings & Reviews', {
            'fields': ('rating', 'reviews'),
            'classes': ('collapse',)
        }),
        ('Management', {
            'fields': ('managed_by', 'landlord_name', 'landlord_verified', 'agency_name', 'agency_verified'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('featured', 'ready_date')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def price_display(self, obj):
        return f"KSh {obj.price:,.0f} {obj.get_price_type_display()}"
    price_display.short_description = 'Price'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px;" />', obj.image)
        return "No image"
    image_preview.short_description = 'Image Preview'

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('guest_name', 'property', 'booking_date', 'status', 'created_at', 'approve_booking')
    list_filter = ('status', 'booking_date', 'created_at')
    search_fields = ('guest_name', 'guest_email', 'property__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    actions = ['approve_bookings', 'reject_bookings']

    def approve_booking(self, obj):
        if obj.status == 'pending':
            return format_html(
                '<a class="button" href="{}" style="background: #28a745; color: white; padding: 5px 10px; border-radius: 3px; text-decoration: none;">Approve</a>',
                f'/admin/myapp/booking/{obj.id}/change/?approve=1'
            )
        elif obj.status == 'confirmed':
            return format_html('<span style="color: #28a745; font-weight: bold;">✓ Approved</span>')
        elif obj.status == 'cancelled':
            return format_html('<span style="color: #dc3545; font-weight: bold;">✗ Rejected</span>')
        return obj.status

    approve_booking.short_description = 'Action'
    approve_booking.allow_tags = True

    def approve_bookings(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'Successfully approved {updated} booking(s).')
    approve_bookings.short_description = 'Approve selected bookings'

    def reject_bookings(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'Successfully rejected {updated} booking(s).')
    reject_bookings.short_description = 'Reject selected bookings'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:booking_id>/approve/', self.approve_booking_view, name='booking_approve'),
        ]
        return custom_urls + urls

    def approve_booking_view(self, request, booking_id):
        booking = get_object_or_404(Booking, id=booking_id)
        if request.method == 'GET' and request.GET.get('approve') == '1':
            booking.status = 'confirmed'
            booking.save()
            self.message_user(request, f'Booking for {booking.guest_name} has been approved.')
            # Here you would send email notification
            self.send_booking_notification(booking, 'approved')
        return redirect('..')

    def send_booking_notification(self, booking, action):
        """Send email notification to guest about booking status"""
        try:
            subject = f"Booking {action.title()}: {booking.property.title}"

            # Create email content
            context = {
                'guest_name': booking.guest_name,
                'property_title': booking.property.title,
                'property_location': booking.property.location,
                'booking_date': booking.booking_date,
                'action': action.title(),
                'status': action.title(),
                'booking_id': booking.id,
            }

            # Plain text message
            message = f"""
Dear {booking.guest_name},

Your booking for {booking.property.title} has been {action}.

Booking Details:
- Property: {booking.property.title}
- Location: {booking.property.location}
- Booking Date: {booking.booking_date}
- Status: {action.title()}
- Booking ID: {booking.id}

Thank you for using Masskan!

Best regards,
Masskan Team
"""

            # Send email
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[booking.guest_email],
                fail_silently=False,
            )

            print(f"Email notification sent successfully to {booking.guest_email} for booking {booking.id}")

        except Exception as e:
            print(f"Failed to send email notification: {str(e)}")
            # In production, you might want to log this error or send an admin notification

@admin.register(MarketplaceItem)
class MarketplaceItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'category', 'condition', 'location', 'created_by', 'created_at')
    list_filter = ('category', 'condition', 'created_at')
    search_fields = ('title', 'description', 'location')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MovingService)
class MovingServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'price_range', 'rating', 'reviews', 'verified', 'created_at')
    list_filter = ('verified', 'created_at')
    search_fields = ('name', 'location')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MoverQuote)
class MoverQuoteAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'service', 'pickup_location', 'delivery_location', 'moving_date', 'status', 'quote_amount', 'created_at')
    list_filter = ('status', 'moving_date', 'created_at')
    search_fields = ('client_name', 'client_email', 'pickup_location', 'delivery_location')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('buyer_name', 'item', 'purchase_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('buyer_name', 'buyer_email', 'item__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'role', 'is_verified', 'created_at')
    list_filter = ('role', 'is_verified', 'created_at')
    search_fields = ('user__username', 'full_name', 'user__email')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'property__title', 'comment')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
