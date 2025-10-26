// User types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'artist';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  priceValue: number;
  currency: string;
  images: string[];
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth?: number;
    unit: string;
  };
  material: string;
  year: number;
  artistId: string;
  artistName: string;
  isAvailable: boolean;
  stock: number;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// Artist types
export interface Artist {
  _id: string;
  userId: string;
  name: string;
  bio: string;
  specialty: string;
  avatar: string;
  coverImage?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  featured: boolean;
  verified: boolean;
  totalProducts: number;
  totalSales: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Filter & Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductFilters extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  artistId?: string;
  search?: string;
  sortBy?: 'createdAt' | 'priceValue' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  isAvailable?: boolean;
}

export interface ArtistFilters extends PaginationParams {
  specialty?: string;
  search?: string;
  featured?: boolean;
  verified?: boolean;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

