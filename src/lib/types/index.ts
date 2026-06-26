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
export interface ColorVariant {
  name: string;
  hexCode?: string;
  images: string[];
  stock: number;
}

export interface SizeVariant {
  size: "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL";
  enabled: boolean;
  stock: number;
}

export interface LimitedTimeOffer {
  enabled: boolean;
  label?: string;
  expiresAt?: Timestamp;
}

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
  hasVariants?: boolean;
  colorVariants?: ColorVariant[];
  sizeVariants?: SizeVariant[];
  limitedTimeOffer?: LimitedTimeOffer;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Collectible / Hot Wheels fields
  type?: "standard" | "collectible";
  isFramable?: boolean;
  scale?: string;            // "1:64", "1:43", "1:24", "1:18"
  series?: string;           // "Car Culture", "Red Line Club", "HW J-Imports"
  modelYear?: number;
  condition?: "loose" | "carded" | "graded";
  rarity?: "common" | "uncommon" | "rare" | "treasure-hunt" | "super-treasure-hunt" | "chase";
  grading?: number;          // 0–10
  isAuthenticated?: boolean;
  packagingType?: "blister-card" | "clamshell" | "box" | "display" | "loose";
}

// ─── FRAME POSITION ───────────────────────────────────────────────────────────
export interface FramePosition {
  id: string;
  label: string;            // "Center Display", "Left Drift", etc.
  x: number;                // 0-100 percent from left
  y: number;                // 0-100 percent from top
  rotation: number;         // degrees
  carScale: number;         // 0-1 size multiplier
  thumbnailUrl?: string;    // preview image
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── FRAME BACKGROUND ────────────────────────────────────────────────────────
export interface FrameBackground {
  id: string;
  label: string;
  imageUrl: string;
  priceAdjustment: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── FRAME SIZE ──────────────────────────────────────────────────────────────
export interface FrameSize {
  id: string;
  label: string;            // "6x8", "8x10", "11x14"
  width: number;            // inches
  height: number;           // inches
  priceAdjustment: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// ─── FRAME PRODUCT ───────────────────────────────────────────────────────────
export interface FrameProduct {
  id: string;
  title: string;
  description: string;
  images: string[];           // frame design mockups (with transparent center)
  basePrice: number;
  discountedPrice?: number;
  stock: number;
  isVisible: boolean;
  isFeatured: boolean;

  // Linked config (IDs from global presets)
  enabledPositionIds: string[];
  enabledBackgroundIds: string[];
  enabledSizeIds: string[];

  // Optional price overrides per option
  positionPriceOverrides?: Record<string, number>;
  backgroundPriceOverrides?: Record<string, number>;
  sizePriceOverrides?: Record<string, number>;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── CUSTOM FRAME CONFIGURATION ─────────────────────────────────────────────
export interface FrameCustomization {
  frameProductId: string;
  frameTitle: string;
  frameImage: string;
  selectedCarId: string;
  selectedCarTitle: string;
  selectedCarImage: string;
  selectedPositionId: string;
  selectedPositionLabel: string;
  selectedBackgroundId: string;
  selectedBackgroundLabel: string;
  selectedBackgroundImage: string;
  selectedSizeId: string;
  selectedSizeLabel: string;
  selectedSizeWidth: number;
  selectedSizeHeight: number;
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
  selectedColor?: string;
  selectedSize?: string;
  category?: string;
  // Item type for adaptive theming
  itemType?: "standard" | "collectible" | "custom-frame";
  // Custom frame data
  frameCustomization?: FrameCustomization;
}

export interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  couponType: "percent" | "fixed";
  couponCategories: string[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  removeCustomItem: (productId: string, frameCustomization?: any) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number, type: "percent" | "fixed", categories?: string[]) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getEligibleSubtotal: () => number;
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
  | "waiting"
  | "shipped"
  | "delivered"
  | "cancelled by user"
  | "cancelled by admin";

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
  paymentMethod: "COD" | "Online";
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
  isVisible: boolean;
  startsAt: Timestamp | null;
  expiresAt: Timestamp | null;
  oneTimeUse: boolean;
  usedBy: string[];
  categories?: string[];
  description?: string;
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

// ─── REVIEW ────────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
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
