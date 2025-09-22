// Centralized API service for Django backend communication
const DJANGO_API_BASE = import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8000/api';

// API Response types
export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page?: number;
  total_pages?: number;
  total_items?: number;
  has_next?: boolean;
  has_previous?: boolean;
}

// Base API client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = DJANGO_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Separate headers from other options to avoid conflicts
    const { headers = {}, ...otherOptions } = options;

    const config: RequestInit = {
      ...otherOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
        errorData.detail ||
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Authenticated request helper
  private async authenticatedRequest<T>(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { headers = {}, ...otherOptions } = options;

    return this.request<T>(endpoint, {
      ...otherOptions,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Properties API
  async getProperties(params?: URLSearchParams): Promise<ApiResponse<any>> {
    const endpoint = params ? `/properties/?${params.toString()}` : '/properties/';
    return this.request(endpoint);
  }

  async getProperty(id: number): Promise<any> {
    return this.request(`/properties/${id}/`);
  }

  async createProperty(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/properties/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: number, data: any, token: string): Promise<any> {
    return this.authenticatedRequest(`/properties/${id}/`, token, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: number, token: string): Promise<void> {
    return this.authenticatedRequest(`/properties/${id}/`, token, {
      method: 'DELETE',
    });
  }

  // Marketplace API
  async getMarketplaceItems(params?: URLSearchParams): Promise<ApiResponse<any>> {
    const endpoint = params ? `/marketplace/?${params.toString()}` : '/marketplace/';
    return this.request(endpoint);
  }

  async createMarketplaceItem(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/marketplace/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Moving Services API
  async getMovingServices(params?: URLSearchParams): Promise<ApiResponse<any>> {
    const endpoint = params ? `/moving-services/?${params.toString()}` : '/moving-services/';
    return this.request(endpoint);
  }

  async createMovingService(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/moving-services/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bookings API
  async getBookings(token: string): Promise<ApiResponse<any>> {
    return this.authenticatedRequest('/bookings/', token);
  }

  async createBooking(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/bookings/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Quotes API
  async getQuotes(token: string): Promise<ApiResponse<any>> {
    return this.authenticatedRequest('/quotes/', token);
  }

  async createQuote(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/quotes/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Purchases API
  async getPurchases(token: string): Promise<ApiResponse<any>> {
    return this.authenticatedRequest('/purchases/', token);
  }

  async createPurchase(data: any, token: string): Promise<any> {
    return this.authenticatedRequest('/purchases/', token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard API
  async getUserDashboard(token: string): Promise<any> {
    return this.authenticatedRequest('/dashboard/', token);
  }

  async getAdminDashboard(token: string): Promise<any> {
    return this.authenticatedRequest('/admin/dashboard/', token);
  }

  // Authentication API
  async login(credentials: { username: string; password: string }): Promise<any> {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any): Promise<any> {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(token: string): Promise<any> {
    return this.authenticatedRequest('/auth/me/', token);
  }

  async updateUserProfile(profileData: any, token: string): Promise<any> {
    return this.authenticatedRequest('/auth/profile/', token, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  // Image Upload API
  async uploadImage(file: File, token: string): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);

    // For file uploads, we need to handle Content-Type specially
    // Create a custom request that doesn't set Content-Type for FormData
    const url = `${this.baseUrl}/upload/image/`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - let browser set it for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error ||
        errorData.detail ||
        `Image upload failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.request('/health/');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export the class for potential customization
export { ApiClient };

// Utility functions
export const buildQueryParams = (params: Record<string, any>): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
};

// Environment configuration helper
export const getApiBaseUrl = (): string => {
  return DJANGO_API_BASE;
};

// Error handling utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error.response) {
    throw new ApiError(
      error.message || 'API request failed',
      error.response.status,
      error.response
    );
  }

  throw new ApiError(error.message || 'Network error occurred');
};