from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, MeView, PropertyViewSet, MarketplaceItemViewSet, MovingServiceViewSet,
    BookingViewSet, MoverQuoteViewSet, PurchaseViewSet, ReviewViewSet,
    user_dashboard, admin_dashboard, health_check, api_404_handler, api_500_handler,
    login_view, register_view, upload_image
)

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'marketplace', MarketplaceItemViewSet, basename='marketplace')
router.register(r'moving-services', MovingServiceViewSet, basename='moving-service')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'quotes', MoverQuoteViewSet, basename='quote')
router.register(r'purchases', PurchaseViewSet, basename='purchase')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    # Authentication
    path('auth/login/', login_view, name='login'),
    path('auth/register/', register_view, name='register'),
    path('auth/me/', MeView.as_view(), name='me'),

    # Dashboard
    path('dashboard/', user_dashboard, name='user_dashboard'),
    path('admin/dashboard/', admin_dashboard, name='admin_dashboard'),

    # Health check
    path('health/', health_check, name='health_check'),

    # Image upload
    path('upload/image/', upload_image, name='upload_image'),

    # API router
    path('', include(router.urls)),
]
