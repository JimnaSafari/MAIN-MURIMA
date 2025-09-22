from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from myapp.models import (
    Property, Booking, MarketplaceItem, MovingService,
    MoverQuote, Purchase, Review, Profile
)
from decimal import Decimal
import random
from datetime import datetime, timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with mock data for development'

    def handle(self, *args, **options):
        self.stdout.write('Starting mock data population...')

        # Create admin user if not exists
        admin_user, created = User.objects.get_or_create(
            username='masskan_admin',
            defaults={
                'email': 'admin@masskan.com',
                'first_name': 'Masskan',
                'last_name': 'Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))

        # Create regular users
        users_data = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith'},
            {'username': 'mike_johnson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Johnson'},
            {'username': 'sarah_wilson', 'email': 'sarah@example.com', 'first_name': 'Sarah', 'last_name': 'Wilson'},
            {'username': 'david_brown', 'email': 'david@example.com', 'first_name': 'David', 'last_name': 'Brown'},
        ]

        users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults=user_data
            )
            if created:
                user.set_password('password123')
                user.save()
            users.append(user)

        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        # Create Properties
        properties_data = [
            {
                'title': 'Modern 2BR Apartment in Kilimani',
                'location': 'Kilimani, Nairobi',
                'county': 'Nairobi',
                'town': 'Kilimani',
                'price': Decimal('45000'),
                'price_type': 'month',
                'type': 'rental',
                'bedrooms': 2,
                'bathrooms': 2,
                'area': 1200,
                'rental_type': 'two-bedroom',
                'image1': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'image2': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'image3': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'image4': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                'image5': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'image6': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
                'image': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'images': ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
                'rating': Decimal('4.5'),
                'reviews': 12,
                'featured': True,
                'managed_by': 'agency',
                'agency_name': 'Prime Properties Ltd',
                'agency_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Kilimani Primary School', 'Nairobi Academy', 'Westlands International School'],
                    'hospitals': ['Nairobi Hospital', 'Kilimani Medical Centre', 'Aga Khan Hospital'],
                    'markets': ['Kilimani Market', 'Sarit Centre', 'Westlands Mall'],
                    'roads': ['Mombasa Road', 'Langata Road', 'Ngong Road']
                },
            },
            {
                'title': 'Luxury 3BR Villa in Karen',
                'location': 'Karen, Nairobi',
                'county': 'Nairobi',
                'town': 'Karen',
                'price': Decimal('120000'),
                'price_type': 'month',
                'type': 'rental',
                'bedrooms': 3,
                'bathrooms': 3,
                'area': 2500,
                'rental_type': 'house',
                'image1': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'image2': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'image3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
                'image4': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
                'image5': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
                'image6': 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800',
                'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
                'rating': Decimal('4.8'),
                'reviews': 8,
                'featured': True,
                'managed_by': 'landlord',
                'landlord_name': 'Dr. James Mwangi',
                'landlord_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Karen International School', 'Nairobi Japanese School', 'Hillcrest International School'],
                    'hospitals': ['Karen Hospital', 'Nairobi West Hospital', 'Mombasa Road Medical Centre'],
                    'markets': ['Karen Shopping Centre', 'Yaya Centre', 'Karen Galleria'],
                    'roads': ['Ngong Road', 'Langata Road', 'Mombasa Road']
                },
            },
            {
                'title': 'Cozy Studio in Westlands',
                'location': 'Westlands, Nairobi',
                'county': 'Nairobi',
                'town': 'Westlands',
                'price': Decimal('25000'),
                'price_type': 'month',
                'type': 'rental',
                'bedrooms': 1,
                'bathrooms': 1,
                'area': 600,
                'rental_type': 'studio',
                'image1': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'image2': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'image3': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                'image4': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'image5': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
                'image6': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'image': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'images': ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
                'rating': Decimal('4.2'),
                'reviews': 15,
                'featured': False,
                'managed_by': 'agency',
                'agency_name': 'Urban Living Properties',
                'agency_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Westlands Primary School', 'International School of Kenya', 'Braeburn School'],
                    'hospitals': ['Westlands Medical Centre', 'Nairobi Women\'s Hospital', 'Mombasa Road Medical Centre'],
                    'markets': ['Westlands Mall', 'Sarit Centre', 'Village Market'],
                    'roads': ['Mombasa Road', 'Woodvale Grove', 'Westlands Road']
                },
            },
            {
                'title': 'Executive Office Space CBD',
                'location': 'CBD, Nairobi',
                'county': 'Nairobi',
                'town': 'CBD',
                'price': Decimal('80000'),
                'price_type': 'month',
                'type': 'office',
                'bedrooms': None,
                'bathrooms': 2,
                'area': 1500,
                'rental_type': None,
                'image1': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'image2': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
                'image3': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
                'image4': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
                'image5': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
                'image6': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
                'image': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                'images': ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
                'rating': Decimal('4.6'),
                'reviews': 6,
                'featured': True,
                'managed_by': 'agency',
                'agency_name': 'Commercial Spaces Ltd',
                'agency_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Central Business District Schools', 'Nearby Educational Institutions'],
                    'hospitals': ['Nairobi Hospital', 'Kenyatta National Hospital', 'Mater Hospital'],
                    'markets': ['River Road Market', 'Luthuli Avenue Shopping', 'CBD Commercial Areas'],
                    'roads': ['Tom Mboya Street', 'Koinange Street', 'Luthuli Avenue']
                },
            },

            {
                'title': 'Spacious 4BR Family Home',
                'location': 'Ruiru, Kiambu',
                'county': 'Kiambu',
                'town': 'Ruiru',
                'price': Decimal('3500000'),
                'price_type': 'sale',
                'type': 'rental',
                'bedrooms': 4,
                'bathrooms': 3,
                'area': 3000,
                'rental_type': 'house',
                'image1': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'image2': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'image3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
                'image4': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
                'image5': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
                'image6': 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800',
                'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
                'rating': Decimal('4.4'),
                'reviews': 9,
                'featured': False,
                'managed_by': 'agency',
                'agency_name': 'Home Solutions Realty',
                'agency_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Ruiru Primary School', 'Juja Road Schools', 'Nearby Educational Centres'],
                    'hospitals': ['Ruiru District Hospital', 'Kiambu Level 4 Hospital'],
                    'markets': ['Ruiru Market', 'Juja Town Market', 'Thika Road Shopping'],
                    'roads': ['Thika Superhighway', 'Juja Road', 'Eastern Bypass']
                },
            },
            # Airbnb Properties
            {
                'title': 'Luxury Kilimani Apartment',
                'location': 'Kilimani, Nairobi',
                'county': 'Nairobi',
                'town': 'Kilimani',
                'price': Decimal('5000'),
                'price_type': 'night',
                'type': 'airbnb',
                'bedrooms': 1,
                'bathrooms': 1,
                'area': 750,
                'rental_type': 'studio',
                'image1': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'image2': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'image3': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                'image4': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'image5': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
                'image6': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'image': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'images': ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
                'rating': Decimal('4.9'),
                'reviews': 35,
                'featured': True,
                'managed_by': 'landlord',
                'landlord_name': 'Jane Doe',
                'landlord_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Kilimani Primary School', 'Nairobi Academy', 'Westlands International School'],
                    'hospitals': ['Nairobi Hospital', 'Kilimani Medical Centre', 'Aga Khan Hospital'],
                    'markets': ['Kilimani Market', 'Sarit Centre', 'Westlands Mall'],
                    'roads': ['Mombasa Road', 'Langata Road', 'Ngong Road']
                },
            },
            {
                'title': 'Cozy Airbnb Studio in Westlands',
                'location': 'Westlands, Nairobi',
                'county': 'Nairobi',
                'town': 'Westlands',
                'price': Decimal('3500'),
                'price_type': 'night',
                'type': 'airbnb',
                'bedrooms': 1,
                'bathrooms': 1,
                'area': 500,
                'rental_type': 'studio',
                'image1': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'image2': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'image3': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                'image4': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'image5': 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
                'image6': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'image': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                'images': ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
                'rating': Decimal('4.7'),
                'reviews': 20,
                'featured': False,
                'managed_by': 'agency',
                'agency_name': 'Kilimani Stays',
                'agency_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Westlands Primary School', 'International School of Kenya', 'Braeburn School'],
                    'hospitals': ['Westlands Medical Centre', 'Nairobi Women\'s Hospital', 'Mombasa Road Medical Centre'],
                    'markets': ['Westlands Mall', 'Sarit Centre', 'Village Market'],
                    'roads': ['Mombasa Road', 'Woodvale Grove', 'Westlands Road']
                },
            },
            {
                'title': 'Charming Airbnb in Chuka',
                'location': 'Chuka, Tharaka Nithi',
                'county': 'Tharaka Nithi',
                'town': 'Chuka',
                'price': Decimal('5000'),
                'price_type': 'night',
                'type': 'airbnb',
                'bedrooms': 2,
                'bathrooms': 1,
                'area': 900,
                'rental_type': 'two-bedroom',
                'image1': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'image2': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'image3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
                'image4': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
                'image5': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
                'image6': 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800',
                'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'],
                'rating': Decimal('4.5'),
                'reviews': 15,
                'featured': False,
                'managed_by': 'landlord',
                'landlord_name': 'Peter Njoroge',
                'landlord_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Chuka Boys High School', 'Chuka Girls High School', 'Meru University'],
                    'hospitals': ['Chuka District Hospital', 'Meru Level 5 Hospital'],
                    'markets': ['Chuka Main Market', 'Meru Central Market'],
                    'roads': ['Nairobi-Meru Highway', 'Chuka-Embu Road']
                },
            },
            {
                'title': 'Comfortable Airbnb in Nkubu',
                'location': 'Nkubu, Meru',
                'county': 'Meru',
                'town': 'Nkubu',
                'price': Decimal('5000'),
                'price_type': 'night',
                'type': 'airbnb',
                'bedrooms': 2,
                'bathrooms': 1,
                'area': 800,
                'rental_type': 'two-bedroom',
                'image1': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'image2': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'image3': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
                'image4': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
                'image5': 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
                'image6': 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800',
                'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
                'rating': Decimal('4.3'),
                'reviews': 10,
                'featured': False,
                'managed_by': 'landlord',
                'landlord_name': 'Mary Wanjiku',
                'landlord_verified': True,
                'ready_date': datetime(2020, 9, 14).date(),
                'amenities': {
                    'schools': ['Nkubu High School', 'Meru School', 'Nearby Schools'],
                    'hospitals': ['Nkubu District Hospital', 'Meru Level 5 Hospital'],
                    'markets': ['Nkubu Market', 'Meru Central Market'],
                    'roads': ['Nairobi-Meru Highway', 'Nkubu-Meru Road']
                },
            },
        ]

        properties = []
        for prop_data in properties_data:
            property_obj, created = Property.objects.get_or_create(
                title=prop_data['title'],
                defaults={
                    **prop_data,
                    'created_by': random.choice(users)
                }
            )
            properties.append(property_obj)

        self.stdout.write(self.style.SUCCESS(f'Created {len(properties)} properties'))

        # Create Marketplace Items
        marketplace_data = [
            {
                'title': 'iPhone 14 Pro Max 256GB',
                'price': Decimal('120000'),
                'category': 'electronics',
                'condition': 'used',
                'description': 'Barely used iPhone 14 Pro Max in excellent condition. Comes with original box and accessories.',
                'location': 'Westlands, Nairobi',
                'image': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
            },
            {
                'title': 'Modern Sofa Set - 7 Seater',
                'price': Decimal('85000'),
                'category': 'furniture',
                'condition': 'new',
                'description': 'Beautiful modern 7-seater sofa set. Perfect for living room. High-quality fabric and sturdy construction.',
                'location': 'Karen, Nairobi',
                'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
            },
            {
                'title': 'Toyota Prado TX 2018',
                'price': Decimal('3200000'),
                'category': 'vehicles',
                'condition': 'used',
                'description': 'Well-maintained Toyota Prado TX 2018 model. Single owner, full service history. Low mileage.',
                'location': 'Kilimani, Nairobi',
                'image': 'https://images.unsplash.com/photo-1549399735-cef2e2c3f638?w=800',
            },
            {
                'title': 'MacBook Pro M2 13-inch',
                'price': Decimal('180000'),
                'category': 'electronics',
                'condition': 'used',
                'description': 'MacBook Pro with M2 chip, 13-inch display, 8GB RAM, 256GB SSD. Excellent condition.',
                'location': 'CBD, Nairobi',
                'image': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
            },
            {
                'title': 'Dining Table Set - 6 Chairs',
                'price': Decimal('45000'),
                'category': 'furniture',
                'condition': 'new',
                'description': 'Elegant wooden dining table with 6 matching chairs. Perfect for family gatherings.',
                'location': 'Ruiru, Kiambu',
                'image': 'https://images.unsplash.com/photo-1577140917170-282099a7e960?w=800',
            },
            {
                'title': 'Samsung 55" 4K Smart TV',
                'price': Decimal('95000'),
                'category': 'electronics',
                'condition': 'new',
                'description': 'Samsung 55-inch 4K UHD Smart TV with HDR. Crystal clear picture quality.',
                'location': 'Westlands, Nairobi',
                'image': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
            },
        ]

        marketplace_items = []
        for item_data in marketplace_data:
            item, created = MarketplaceItem.objects.get_or_create(
                title=item_data['title'],
                defaults={
                    **item_data,
                    'created_by': random.choice(users)
                }
            )
            marketplace_items.append(item)

        self.stdout.write(self.style.SUCCESS(f'Created {len(marketplace_items)} marketplace items'))

        # Create Moving Services
        moving_services_data = [
            {
                'name': 'Swift Movers Kenya',
                'location': 'Nairobi',
                'price_range': 'KSh 15,000 - KSh 150,000',
                'services': ['House Moving', 'Office Relocation', 'Packing Services', 'Storage Solutions'],
                'image': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
                'rating': Decimal('4.6'),
                'reviews': 45,
                'verified': True,
            },
            {
                'name': 'Reliable Relocations Ltd',
                'location': 'Nairobi',
                'price_range': 'KSh 20,000 - KSh 200,000',
                'services': ['Local Moving', 'Long Distance', 'Furniture Moving', 'Piano Moving'],
                'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                'rating': Decimal('4.8'),
                'reviews': 67,
                'verified': True,
            },
            {
                'name': 'Budget Movers Nairobi',
                'location': 'Nairobi',
                'price_range': 'KSh 10,000 - KSh 80,000',
                'services': ['Apartment Moving', 'Student Moves', 'Small Office Moves'],
                'image': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
                'rating': Decimal('4.3'),
                'reviews': 32,
                'verified': True,
            },
            {
                'name': 'Elite Moving Solutions',
                'location': 'Nairobi',
                'price_range': 'KSh 25,000 - KSh 300,000',
                'services': ['Luxury Moves', 'International Shipping', 'Art & Antique Moving', 'Vehicle Transport'],
                'image': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                'rating': Decimal('4.9'),
                'reviews': 89,
                'verified': True,
            },
        ]

        moving_services = []
        for service_data in moving_services_data:
            service, created = MovingService.objects.get_or_create(
                name=service_data['name'],
                defaults={
                    **service_data,
                    'created_by': random.choice(users)
                }
            )
            moving_services.append(service)

        self.stdout.write(self.style.SUCCESS(f'Created {len(moving_services)} moving services'))

        # Create some sample reviews
        reviews_data = [
            {
                'property': properties[0],
                'user': users[0],
                'rating': 5,
                'comment': 'Excellent apartment! Very clean and well-maintained. The location is perfect.',
            },
            {
                'property': properties[1],
                'user': users[1],
                'rating': 4,
                'comment': 'Beautiful villa with great amenities. Highly recommended for families.',
            },
            {
                'property': properties[2],
                'user': users[2],
                'rating': 4,
                'comment': 'Cozy studio perfect for singles. Great value for money.',
            },
        ]

        for review_data in reviews_data:
            Review.objects.get_or_create(
                property=review_data['property'],
                user=review_data['user'],
                defaults={
                    'rating': review_data['rating'],
                    'comment': review_data['comment'],
                }
            )

        self.stdout.write(self.style.SUCCESS('Created sample reviews'))

        # Create sample bookings
        bookings_data = [
            {
                'property': properties[0],
                'user': users[0],
                'guest_name': 'John Doe',
                'guest_email': 'john@example.com',
                'guest_phone': '+254712345678',
                'booking_date': datetime.now().date() + timedelta(days=7),
                'check_in_date': datetime.now().date() + timedelta(days=7),
                'check_out_date': datetime.now().date() + timedelta(days=14),
                'status': 'confirmed',
            },
            {
                'property': properties[4],
                'user': users[1],
                'guest_name': 'Jane Smith',
                'guest_email': 'jane@example.com',
                'guest_phone': '+254723456789',
                'booking_date': datetime.now().date() + timedelta(days=3),
                'check_in_date': datetime.now().date() + timedelta(days=3),
                'check_out_date': datetime.now().date() + timedelta(days=5),
                'status': 'pending',
            },
        ]

        for booking_data in bookings_data:
            Booking.objects.get_or_create(
                property=booking_data['property'],
                user=booking_data['user'],
                booking_date=booking_data['booking_date'],
                defaults=booking_data
            )

        self.stdout.write(self.style.SUCCESS('Created sample bookings'))

        self.stdout.write(self.style.SUCCESS('Mock data population completed successfully!'))
        self.stdout.write('You can now access the app with realistic data.')
