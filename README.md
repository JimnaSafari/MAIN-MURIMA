# 🏠 Masskan Murima Nexus

**A comprehensive property and services platform for Kenya** - connecting property seekers with rentals, offices, Airbnb stays, and professional moving services.

## 🌟 Features

### 🏢 Property Services
- **House Rentals** - Long-term rental properties across Kenyan counties
- **Office Spaces** - Flexible office rentals and co-working spaces
- **Airbnb Stays** - Short-term accommodations with verified hosts
- **Property Listings** - Easy property listing and management

### 🚛 Moving & Logistics
- **Professional Movers** - Licensed and insured moving services
- **Moving Quotes** - Instant quotes based on property size and distance
- **Packing Services** - Professional packing and unpacking
- **Storage Solutions** - Secure storage facilities

### 👤 User Management
- **User Authentication** - Secure JWT-based authentication
- **Dashboard** - Personal dashboard for bookings and purchases
- **Profile Management** - User profile and preferences
- **Admin Panel** - Administrative oversight and analytics

### 🛠️ Advanced Features
- **Location-Based Search** - Search by county and town across Kenya
- **Real-time Filtering** - Dynamic filtering by price, type, amenities
- **Booking System** - Seamless booking and payment integration
- **Review System** - User reviews and ratings
- **Image Gallery** - Property photo galleries and virtual tours

## 🏗️ Architecture

### Backend (Django REST Framework)
```
django-backend/
├── myapp/                 # Main application
│   ├── models.py         # Database models
│   ├── views.py          # API endpoints
│   ├── serializers.py    # Data serialization
│   ├── urls.py          # URL routing
│   └── admin.py         # Admin interface
├── myproject/            # Django project settings
├── db.sqlite3           # SQLite database (dev)
└── requirements.txt     # Python dependencies
```

### Frontend (React + TypeScript)
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── data/               # Static data (locations, etc.)
└── integrations/       # External service integrations
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** - Backend requirements
- **Node.js 16+** - Frontend development
- **PostgreSQL** - Production database (SQLite for development)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd masskan-murima-nexus
```

2. **Setup Backend**
```bash
cd django-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Setup Frontend**
```bash
# In a new terminal
npm install
npm run dev
```

4. **Access the application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🗄️ Database Models

### Core Models
- **User** - User accounts and authentication
- **Property** - Rental properties, offices, Airbnb listings
- **Booking** - Property bookings and reservations
- **MovingService** - Moving service providers
- **MovingQuote** - Moving service quotes and requests
- **Review** - User reviews and ratings

### Supporting Models
- **Location** - Kenyan counties and towns
- **Category** - Property and service categories
- **Image** - Property and service images

## 🔧 Configuration

### Environment Variables
Create `.env` file in `django-backend/` directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Email (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# File Storage (Optional)
USE_S3=False
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

## 🚀 Deployment

### Supported Platforms
- **Render** - Full-stack deployment with managed database
- **Railway** - Django-optimized deployment
- **Vercel** - Frontend deployment (backend on Railway)

### Quick Deployment
```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to your preferred platform
./deploy.sh render    # or railway, or vercel
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
cd django-backend
python manage.py runserver        # Start Django server
python manage.py makemigrations   # Create migrations
python manage.py migrate          # Apply migrations
python manage.py test            # Run tests
```

### Project Structure
```
masskan-murima-nexus/
├── django-backend/          # Django REST API
├── src/                     # React frontend
├── public/                  # Static assets
├── supabase/               # Database migrations (legacy)
├── render.yaml             # Render deployment config
├── railway.json            # Railway deployment config
├── vercel.json             # Vercel deployment config
└── DEPLOYMENT.md           # Deployment guide
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout

### Properties
- `GET /api/properties/` - List properties
- `POST /api/properties/` - Create property
- `GET /api/properties/{id}/` - Property details
- `PUT /api/properties/{id}/` - Update property

### Bookings
- `GET /api/bookings/` - User bookings
- `POST /api/bookings/` - Create booking
- `PUT /api/bookings/{id}/` - Update booking

### Moving Services
- `GET /api/moving-services/` - List moving services
- `POST /api/quotes/` - Request moving quote
- `GET /api/quotes/` - User quotes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/masskan-murima-nexus/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/masskan-murima-nexus/discussions)
- **Email**: support@masskanmurima.com

## 🙏 Acknowledgments

- Built with [Django REST Framework](https://www.django-rest-framework.org/)
- Frontend powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Masskan Murima Nexus** - Your comprehensive property and services platform for Kenya 🇰🇪
