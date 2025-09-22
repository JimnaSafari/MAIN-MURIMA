import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Property, Booking, Review
from datetime import date

User = get_user_model()

@pytest.mark.django_db
def test_booking_overlap_prevented():
    user = User.objects.create_user(username='u1', password='pass')
    property = Property.objects.create(
        title='Test Property',
        location='Test Location',
        price=1000.00,
        image='test.jpg',
        created_by=user
    )
    Booking.objects.create(
        property=property,
        user=user,
        guest_name='John Doe',
        guest_email='john@example.com',
        guest_phone='1234567890',
        booking_date=date.today(),
        check_in_date=date(2025, 1, 10),
        check_out_date=date(2025, 1, 15)
    )

    # This should raise a ValidationError due to overlap
    with pytest.raises(Exception):
        Booking.objects.create(
            property=property,
            user=user,
            guest_name='Jane Doe',
            guest_email='jane@example.com',
            guest_phone='0987654321',
            booking_date=date.today(),
            check_in_date=date(2025, 1, 12),
            check_out_date=date(2025, 1, 20)
        )

class AuthAPITest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.token_url = reverse('token_obtain_pair')
        self.me_url = reverse('me')
        self.username = "testuser"
        self.password = "strong-pass-123"
        self.user = User.objects.create_user(username=self.username, email="t@example.com", password=self.password)

    def test_register(self):
        payload = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123"
        }
        resp = self.client.post(self.register_url, payload, format='json')
        assert resp.status_code == status.HTTP_201_CREATED
        assert resp.data["username"] == payload["username"]

    def test_token_obtain_and_me(self):
        resp = self.client.post(self.token_url, {"username": self.username, "password": self.password}, format='json')
        assert resp.status_code == status.HTTP_200_OK
        assert "access" in resp.data
        token = resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        me = self.client.get(self.me_url)
        assert me.status_code == status.HTTP_200_OK
        assert me.data["username"] == self.username

class ListingsAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="owner", password="pass1234")
        token_resp = self.client.post(reverse('token_obtain_pair'), {"username": "owner", "password": "pass1234"}, format='json')
        self.token = token_resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.list_url = reverse('property-list')

    def _make_image(self, name="img.gif"):
        return SimpleUploadedFile(name, b'\x47\x49\x46\x38\x39\x61', content_type='image/gif')

    def test_create_listing_with_images(self):
        img1 = self._make_image("a.gif")
        img2 = self._make_image("b.gif")
        data = {
            "title": "Test Property",
            "location": "Test Location",
            "price": 1000.00,
            "image": img1,
            "images": [img2]
        }
        resp = self.client.post(self.list_url, data, format='multipart')
        assert resp.status_code == status.HTTP_201_CREATED
        assert "images" in resp.data
        assert len(resp.data["images"]) >= 1

    def test_listings_filter_search(self):
        Property.objects.create(title="Kilimani Home", location="Kilimani", price=1000.00, image='test.jpg', created_by=self.user)
        Property.objects.create(title="Nkubu Shop", location="Nkubu", price=2000.00, image='test2.jpg', created_by=self.user)
        resp = self.client.get(self.list_url + "?search=Kilimani")
        assert resp.status_code == status.HTTP_200_OK
        names = [item["title"] for item in resp.data["results"]]
        assert any("Kilimani" in name for name in names)

    def test_only_owner_can_update(self):
        # create property as owner
        resp = self.client.post(self.list_url, {"title": "Owned", "location": "T", "price": 1000.00, "image": "test.jpg"}, format='json')
        pk = resp.data["id"]
        detail = reverse('property-detail', args=[pk])
        # create another user and attempt update
        other = User.objects.create_user(username="other", password="pw12345")
        token_resp = self.client.post(reverse('token_obtain_pair'), {"username": "other", "password": "pw12345"}, format='json')
        other_token = token_resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {other_token}")
        patch = self.client.patch(detail, {"title": "Hacked"}, format='json')
        assert patch.status_code == status.HTTP_403_FORBIDDEN

class BookingsAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="booker", password="bpass123")
        token_resp = self.client.post(reverse('token_obtain_pair'), {"username": "booker", "password": "bpass123"}, format='json')
        self.token = token_resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.owner = User.objects.create_user(username="owner2", password="opass")
        self.listing = Property.objects.create(owner=self.owner, title="BList", location="TownX", price=1000.00, image='test.jpg')
        self.booking_url = reverse('booking-list')

    def test_create_booking(self):
        payload = {
            "property": self.listing.id,
            "start_date": "2025-09-20",
            "end_date": "2025-09-25",
            "guests": 2
        }
        resp = self.client.post(self.booking_url, payload, format='json')
        assert resp.status_code == status.HTTP_201_CREATED
        assert Booking.objects.filter(property=self.listing).count() == 1

    def test_prevent_overlapping_booking(self):
        Booking.objects.create(property=self.listing, user=self.user, start_date=date(2025,10,1), end_date=date(2025,10,5), guests=1)
        payload = {
            "property": self.listing.id,
            "start_date": "2025-10-04",
            "end_date": "2025-10-10",
            "guests": 1
        }
        resp = self.client.post(self.booking_url, payload, format='json')
        assert resp.status_code == status.HTTP_400_BAD_REQUEST
        assert "Listing is already booked" in str(resp.data) or resp.status_code == status.HTTP_400_BAD_REQUEST

class ReviewsAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="revuser", password="revpass")
        token_resp = self.client.post(reverse('token_obtain_pair'), {"username": "revuser", "password": "revpass"}, format='json')
        self.token = token_resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")
        self.owner = User.objects.create_user(username="owner3", password="opass3")
        self.listing = Property.objects.create(owner=self.owner, title="RList", location="TownR", price=1000.00, image='test.jpg')
        self.review_url = reverse('review-list')

    def test_create_review(self):
        payload = {"property": self.listing.id, "rating": 5, "comment": "Great place"}
        resp = self.client.post(self.review_url, payload, format='json')
        assert resp.status_code == status.HTTP_201_CREATED
        assert Review.objects.filter(property=self.listing).count() == 1
