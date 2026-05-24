// Firestore helpers for products, orders, coupons, banners, categories, settings
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./config";
import {
  Product,
  Order,
  Coupon,
  Banner,
  Category,
  StoreSettings,
  CartItem,
  DeliveryAddress,
} from "@/lib/types";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("isVisible", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("isFeatured", "==", true),
    where("isVisible", "==", true),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getNewArrivals(): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("isNew", "==", true),
    where("isVisible", "==", true),
    orderBy("createdAt", "desc"),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getHotProducts(): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("isHot", "==", true),
    where("isVisible", "==", true),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const q = query(
    collection(db, "products"),
    where("category", "==", category),
    where("isVisible", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

// ─── BANNERS ─────────────────────────────────────────────────────────────────

export async function getActiveBanners(): Promise<Banner[]> {
  const q = query(
    collection(db, "banners"),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
}

export async function getAllBanners(): Promise<Banner[]> {
  const snap = await getDocs(collection(db, "banners"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
}

export async function saveBanner(
  id: string | null,
  data: Omit<Banner, "id">
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, "banners", id), data);
  } else {
    await addDoc(collection(db, "banners"), data);
  }
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, "banners", id));
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const q = query(
    collection(db, "categories"),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export async function validateCoupon(
  code: string,
  orderTotal: number
): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
  const q = query(
    collection(db, "coupons"),
    where("code", "==", code.toUpperCase()),
    where("isActive", "==", true)
  );
  const snap = await getDocs(q);

  if (snap.empty) return { valid: false, message: "Invalid coupon code" };

  const coupon = { id: snap.docs[0].id, ...snap.docs[0].data() } as Coupon;

  if (coupon.expiresAt && coupon.expiresAt.toDate() < new Date()) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  if (orderTotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Minimum order of ₹${coupon.minOrder} required`,
    };
  }

  return { valid: true, coupon };
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, "coupons"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon));
}

export async function saveCoupon(
  id: string | null,
  data: Omit<Coupon, "id">
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, "coupons", id), data);
  } else {
    await addDoc(collection(db, "coupons"), data);
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, "coupons", id));
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function placeOrder(
  userId: string,
  userEmail: string,
  items: CartItem[],
  subtotal: number,
  discount: number,
  couponCode: string,
  total: number,
  deliveryAddress: DeliveryAddress,
  location: { lat: number; lng: number } | null,
  notes: string
): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    userId,
    userEmail,
    items,
    subtotal,
    discount,
    couponCode,
    total,
    paymentMethod: "COD",
    status: "pending",
    deliveryAddress,
    location,
    notes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  await updateDoc(doc(db, "orders", id), {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ─── STORE SETTINGS ──────────────────────────────────────────────────────────

const SETTINGS_DOC = doc(db, "settings", "store");

export async function getStoreSettings(): Promise<StoreSettings> {
  const snap = await getDoc(SETTINGS_DOC);
  if (!snap.exists()) {
    // Return defaults
    return {
      isOpen: true,
      deliveryAvailable: true,
      accentColor: "#9333ea",
      flashSaleActive: false,
      flashSaleEndsAt: null,
      currency: "INR",
      currencySymbol: "₹",
    };
  }
  return snap.data() as StoreSettings;
}

export async function updateStoreSettings(
  data: Partial<StoreSettings>
): Promise<void> {
  await setDoc(SETTINGS_DOC, data, { merge: true });
}
