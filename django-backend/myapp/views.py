from rest_framework import generics, permissions, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters import rest_framework as filters
from .serializers import RegisterSerializer, UserSerializer, PropertySerializer, BookingSerializer, MarketplaceItemSerializer, MovingServiceSerializer, MoverQuoteSerializer, PurchaseSerializer, ReviewSerializer
from django.contrib.auth import get_user_model, authenticate
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Count
from django.core.paginator import Paginator
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import json
import os
import uuid
from .models import Property, Booking, MarketplaceItem, MovingService, MoverQuote, Purchase, Profile, Review

User = get_user_model()

# Create your views here.

# Permissions
class IsAdminOrReadOnly(permissions.BasePermission):
    """Allow read-only requests for anyone; write operations only for admin/staff."""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for staff/superuser
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or user.is_superuser))

# Properties API
@require_http_methods(["GET"])
def properties_list(request):
    """
    List properties with advanced filtering
    Query parameters:
    - county: Filter by county
    - town: Filter by town
    - property_type: rental/sale
    - rental_type: single/bedsitter/etc
    - min_price: Minimum price
    - max_price: Maximum price
    - bedrooms: Number of bedrooms
    - featured: true/false
    """
    queryset = Property.objects.all()

    # Apply filters
    county = request.GET.get('county')
    if county:
        queryset = queryset.filter(Q(location__icontains=county))

    town = request.GET.get('town')
    if town:
        queryset = queryset.filter(Q(location__icontains=town))

    property_type = request.GET.get('property_type')
    if property_type:
        queryset = queryset.filter(type=property_type)

    rental_type = request.GET.get('rental_type')
    if rental_type:
        queryset = queryset.filter(rental_type=rental_type)

    min_price = request.GET.get('min_price')
    if min_price:
        queryset = queryset.filter(price__gte=min_price)

    max_price = request.GET.get('max_price')
    if max_price:
        queryset = queryset.filter(price__lte=max_price)

    bedrooms = request.GET.get('bedrooms')
    if bedrooms:
        queryset = queryset.filter(bedrooms=bedrooms)

    featured = request.GET.get('featured')
    if featured == 'true':
        queryset = queryset.filter(featured=True)

    # Pagination
    page = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', 12)
    paginator = Paginator(queryset, per_page)
    properties_page = paginator.page(page)

    properties_data = []
    for prop in properties_page.object_list:
        properties_data.append({
            'id': prop.id,
            'title': prop.title,
            'location': prop.location,
            'price': float(prop.price),
            'price_type': prop.price_type,
            'rating': float(prop.rating) if prop.rating else None,
        })

    return JsonResponse({
        'properties': properties_data,
        'pagination': {
            'page': properties_page.number,
            'total_pages': paginator.num_pages,
            'total_items': paginator.count,
            'has_next': properties_page.has_next(),
            'has_previous': properties_page.has_previous(),
        }
    })

@csrf_exempt
@require_http_methods(["POST"])
def create_mover_quote(request, service_id):
    """Create a quote request for moving service"""
    try:
        data = json.loads(request.body)
        service = get_object_or_404(MovingService, id=service_id)

        # In a real app, you'd get the user from authentication
        user = request.user if request.user.is_authenticated else None
        if not user:
            return JsonResponse({'error': 'Authentication required'}, status=401)

        quote = MoverQuote.objects.create(
            service=service,
            user=user,
            client_name=data['client_name'],
            client_email=data['client_email'],
            client_phone=data['client_phone'],
            pickup_location=data['pickup_location'],
            delivery_location=data['delivery_location'],
            moving_date=data['moving_date'],
            inventory=data.get('inventory'),
        )

        return JsonResponse({
            'id': quote.id,
            'service_id': quote.service.id,
            'client_name': quote.client_name,
            'pickup_location': quote.pickup_location,
            'delivery_location': quote.delivery_location,
            'moving_date': quote.moving_date.isoformat(),
            'status': quote.status,
            'created_at': quote.created_at.isoformat(),
        }, status=201)
    except KeyError as e:
        return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Legacy API (keeping for compatibility)
@require_http_methods(["GET"])
def item_list(request):
    """Legacy endpoint - returns empty list"""
    return JsonResponse([], safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def item_create(request):
    """Legacy endpoint - returns error"""
    return JsonResponse({'error': 'This endpoint is deprecated. Use specific model endpoints.'}, status=410)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class PropertyFilter(filters.FilterSet):
    county = filters.CharFilter(field_name='location', lookup_expr='icontains')
    town = filters.CharFilter(field_name='location', lookup_expr='icontains')
    property_type = filters.CharFilter(field_name='type')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Property
        fields = ['type', 'rental_type', 'location', 'price', 'bedrooms', 'featured', 'county', 'town', 'property_type', 'min_price', 'max_price']

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = PropertyFilter
    search_fields = ['title', 'location', 'rental_type']
    ordering_fields = ['created_at', 'price', 'rating']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        queryset = Property.objects.all()
        created_by_user = self.request.query_params.get('created_by_user', None)

        if created_by_user and self.request.user.is_authenticated:
            queryset = queryset.filter(created_by=self.request.user)

        return queryset

class MarketplaceItemFilter(filters.FilterSet):
    category = filters.CharFilter(field_name='category')
    condition = filters.CharFilter(field_name='condition')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = MarketplaceItem
        fields = ['category', 'condition', 'location', 'min_price', 'max_price']

class MarketplaceItemViewSet(viewsets.ModelViewSet):
    queryset = MarketplaceItem.objects.all()
    serializer_class = MarketplaceItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = MarketplaceItemFilter
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['created_at', 'price']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class MovingServiceFilter(filters.FilterSet):
    verified = filters.BooleanFilter(field_name='verified')

    class Meta:
        model = MovingService
        fields = ['location', 'verified']

class MovingServiceViewSet(viewsets.ModelViewSet):
    queryset = MovingService.objects.all()
    serializer_class = MovingServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = MovingServiceFilter
    search_fields = ['name', 'location']
    ordering_fields = ['created_at', 'rating', 'name']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'property']
    ordering_fields = ['created_at', 'booking_date']

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            from rest_framework.response import Response
            from rest_framework import status
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        # Users can only see their own bookings
        return self.queryset.filter(user=self.request.user)

class MoverQuoteViewSet(viewsets.ModelViewSet):
    queryset = MoverQuote.objects.all()
    serializer_class = MoverQuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'service']
    ordering_fields = ['created_at', 'moving_date']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        # Users can only see their own quotes
        return self.queryset.filter(user=self.request.user)

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status']
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

    def get_queryset(self):
        # Users can only see their own purchases
        return self.queryset.filter(buyer=self.request.user)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['property', 'rating']
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Dashboard API Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_dashboard(request):
    """Get user's dashboard data"""
    user = request.user

    # Get user's bookings
    bookings = Booking.objects.filter(user=user).select_related('property').order_by('-created_at')[:5]

    # Get user's purchases
    purchases = Purchase.objects.filter(buyer=user).select_related('item').order_by('-created_at')[:5]

    # Get user's quotes
    quotes = MoverQuote.objects.filter(user=user).select_related('service').order_by('-created_at')[:5]

    # Get user's marketplace items
    marketplace_items = MarketplaceItem.objects.filter(created_by=user).order_by('-created_at')[:5]

    # Get user's properties (if any)
    user_properties = Property.objects.filter(created_by=user).order_by('-created_at')[:5]

    # Serialize data
    dashboard_data = {
        'user': UserSerializer(user).data,
        'bookings': [{
            'id': booking.id,
            'property_title': booking.property.title,
            'property_image': booking.property.image,
            'booking_date': booking.booking_date,
            'status': booking.status,
            'created_at': booking.created_at,
        } for booking in bookings],
        'purchases': [{
            'id': purchase.id,
            'item_title': purchase.item.title,
            'item_image': purchase.item.image,
            'purchase_price': float(purchase.purchase_price),
            'status': purchase.status,
            'created_at': purchase.created_at,
        } for purchase in purchases],
        'quotes': [{
            'id': quote.id,
            'service_name': quote.service.name,
            'service_image': quote.service.image,
            'moving_date': quote.moving_date,
            'status': quote.status,
            'quote_amount': float(quote.quote_amount) if quote.quote_amount else None,
            'created_at': quote.created_at,
        } for quote in quotes],
        'marketplace_items': [{
            'id': item.id,
            'title': item.title,
            'image': item.image,
            'price': float(item.price),
            'status': 'active',  # Assuming all are active
            'created_at': item.created_at,
        } for item in marketplace_items],
        'user_properties': [{
            'id': prop.id,
            'title': prop.title,
            'image': prop.image,
            'price': float(prop.price),
            'type': prop.type,
            'created_at': prop.created_at,
        } for prop in user_properties],
        'stats': {
            'total_bookings': Booking.objects.filter(user=user).count(),
            'total_purchases': Purchase.objects.filter(buyer=user).count(),
            'total_quotes': MoverQuote.objects.filter(user=user).count(),
            'active_listings': MarketplaceItem.objects.filter(created_by=user).count(),
        }
    }

    return Response(dashboard_data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_image(request):
    """Upload image for authenticated users. Stores file via default storage and returns a URL."""
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

    image_file = request.FILES['image']

    # Validate file type
    allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate file size (max 5MB)
    max_size = 5 * 1024 * 1024  # 5MB
    if image_file.size > max_size:
        return Response({'error': 'File too large. Maximum size is 5MB.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Generate unique filename
        file_extension = os.path.splitext(image_file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"

        # Save file
        file_path = os.path.join('uploads', unique_filename)
        file_name = default_storage.save(file_path, ContentFile(image_file.read()))

        # Generate URL
        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
            image_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_name}"
        else:
            image_url = f"{settings.MEDIA_URL}{file_name}"

        return Response({
            'success': True,
            'image_url': image_url,
            'file_name': file_name,
            'message': 'Image uploaded successfully'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Login view that returns JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'error': 'Please provide both username and password'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({
            'error': 'Account is disabled'
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'access': access_token,
            'refresh': refresh_token,
        }
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    """Register new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate JWT tokens for new user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': access_token,
                'refresh': refresh_token,
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Health check endpoint
@api_view(['GET'])
def health_check(request):
    """Health check endpoint for monitoring"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0',
        'services': {
            'database': 'connected',
            'django_auth': 'configured'
        }
    })

# Error handling views
@api_view(['GET'])
def api_404_handler(request, exception=None):
    """Handle 404 errors for API"""
    return Response({
        'error': 'Not Found',
        'message': 'The requested resource was not found.',
        'status_code': 404
    }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def api_500_handler(request, exception=None):
    """Handle 500 errors for API"""
    return Response({
        'error': 'Internal Server Error',
        'message': 'An unexpected error occurred.',
        'status_code': 500
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_dashboard(request):
    """Get admin dashboard data"""
    user = request.user

    # Check if user is admin
    if not user.is_staff and not user.is_superuser:
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

    # Get overall statistics
    total_properties = Property.objects.count()
    total_bookings = Booking.objects.count()
    total_purchases = Purchase.objects.count()
    total_quotes = MoverQuote.objects.count()
    total_users = User.objects.count()

    # Get recent bookings
    recent_bookings = Booking.objects.select_related('property', 'user').order_by('-created_at')[:10]

    # Get recent purchases
    recent_purchases = Purchase.objects.select_related('item', 'buyer').order_by('-created_at')[:10]

    # Get recent quotes
    recent_quotes = MoverQuote.objects.select_related('service', 'user').order_by('-created_at')[:10]

    dashboard_data = {
        'stats': {
            'total_properties': total_properties,
            'total_bookings': total_bookings,
            'total_purchases': total_purchases,
            'total_quotes': total_quotes,
            'total_users': total_users,
        },
        'recent_bookings': [{
            'id': booking.id,
            'guest_name': booking.guest_name,
            'property_title': booking.property.title,
            'booking_date': booking.booking_date,
            'status': booking.status,
            'created_at': booking.created_at,
        } for booking in recent_bookings],
        'recent_purchases': [{
            'id': purchase.id,
            'buyer_name': purchase.buyer_name,
            'item_title': purchase.item.title,
            'purchase_price': float(purchase.purchase_price),
            'status': purchase.status,
            'created_at': purchase.created_at,
        } for purchase in recent_purchases],
        'recent_quotes': [{
            'id': quote.id,
            'client_name': quote.client_name,
            'service_name': quote.service.name,
            'moving_date': quote.moving_date,
            'status': quote.status,
            'quote_amount': float(quote.quote_amount) if quote.quote_amount else None,
            'created_at': quote.created_at,
        } for quote in recent_quotes],
    }

    return Response(dashboard_data)
