// All TypeScript interfaces for MIAKSAAA
import { Timestamp } from "firebase/firestore";

// ─── USER ───────────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: Timestamp;
  address?: DeliveryAddress | null;
  phone?: string | null;
}

// ─── PRODUCT ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isHot: boolean;
  isOnSale: boolean;
  isVisible: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── CART ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  couponType: "percent" | "fixed";
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number, type: "percent" | "fixed") => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  title: string;
  price: number;
  discountedPrice?: number;
  image: string;
  addedAt: Date;
}

export interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// ─── ORDER ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "COD";
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  location?: { lat: number; lng: number } | null;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── COUPON ───────────────────────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percent" | "fixed";
  minOrder: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Timestamp | null;
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  bgColor: string;
  promoTag?: string;
  highlightLabel?: string;
  isActive: boolean;
  order: number;
}

// ─── CATEGORY ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  isActive: boolean;
}

// ─── STORE SETTINGS ───────────────────────────────────────────────────────────
export interface StoreSettings {
  isOpen: boolean;
  deliveryAvailable: boolean;
  accentColor: string;
  logoUrl?: string;
  flashSaleActive: boolean;
  flashSaleEndsAt?: Timestamp | null;
  storeMessage?: string;
  currency: string;
  currencySymbol: string;
}
