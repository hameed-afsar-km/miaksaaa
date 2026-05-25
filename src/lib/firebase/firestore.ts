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
  increment,
  arrayUnion,
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

async function getVisibleProductsRaw(): Promise<Product[]> {
  try {
    const snap = await getDocs(query(collection(db, "products"), where("isVisible", "==", true)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await getVisibleProductsRaw();
  return products.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
    const bTime = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
    return bTime - aTime;
  });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getVisibleProductsRaw();
  return products.filter((p) => p.isFeatured).slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await getVisibleProductsRaw();
  return products
    .filter((p) => p.isNew)
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
      const bTime = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
      return bTime - aTime;
    })
    .slice(0, 8);
}

export async function getHotProducts(): Promise<Product[]> {
  const products = await getVisibleProductsRaw();
  return products.filter((p) => p.isHot).slice(0, 8);
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
  try {
    const snap = await getDocs(collection(db, "banners"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Banner))
      .filter((b) => b.isActive)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error("Failed to fetch active banners:", err);
    return [];
  }
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

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function saveCategory(
  id: string | null,
  data: Omit<Category, "id">
): Promise<void> {
  if (id) {
    await updateDoc(doc(db, "categories", id), data);
  } else {
    await addDoc(collection(db, "categories"), data);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// ─── COUPONS ─────────────────────────────────────────────────────────────────

export async function validateCoupon(
  code: string,
  orderTotal: number,
  userId?: string
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

  if (coupon.oneTimeUse && userId && coupon.usedBy?.includes(userId)) {
    return { valid: false, message: "You have already used this coupon" };
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
  notes: string,
  paymentMethod: "COD" | "Online" = "COD"
): Promise<string> {
  // 1. Create order document with 'waiting' status
  const ref = await addDoc(collection(db, "orders"), {
    userId,
    userEmail,
    items,
    subtotal,
    discount,
    couponCode,
    total,
    paymentMethod,
    status: "waiting",
    deliveryAddress,
    location,
    notes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Reduce stock for each product ordered
  for (const item of items) {
    try {
      const productRef = doc(db, "products", item.productId);
      await updateDoc(productRef, {
        stock: increment(-item.quantity),
      });
    } catch (err) {
      console.error(`Failed to reduce stock for product ${item.productId}:`, err);
    }
  }

  // 3. Track coupon usage if a coupon was used
  if (couponCode) {
    try {
      const couponQuery = query(
        collection(db, "coupons"),
        where("code", "==", couponCode.toUpperCase())
      );
      const couponSnap = await getDocs(couponQuery);
      if (!couponSnap.empty) {
        const couponDoc = couponSnap.docs[0];
        const couponRef = doc(db, "coupons", couponDoc.id);
        await updateDoc(couponRef, {
          usedCount: increment(1),
          usedBy: arrayUnion(userId),
        });
      }
    } catch (err) {
      console.error("Failed to update coupon usage:", err);
    }
  }

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
  const orderRef = doc(db, "orders", id);
  
  try {
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      const orderData = snap.data();
      const oldStatus = orderData.status;

      // Check if changing to a cancelled status from a non-cancelled status
      const isNowCancelled = status === "cancelled by user" || status === "cancelled by admin";
      const wasAlreadyCancelled = oldStatus === "cancelled by user" || oldStatus === "cancelled by admin";

      if (isNowCancelled && !wasAlreadyCancelled) {
        const items = orderData.items || [];
        for (const item of items) {
          try {
            const productRef = doc(db, "products", item.productId);
            await updateDoc(productRef, {
              stock: increment(item.quantity),
            });
          } catch (err) {
            console.error(`Failed to restore stock for product ${item.productId}:`, err);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading order for stock check:", err);
  }

  await updateDoc(orderRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

export async function deleteAllOrders(): Promise<void> {
  const snap = await getDocs(collection(db, "orders"));
  const batch = snap.docs.map((d) => deleteDoc(doc(db, "orders", d.id)));
  await Promise.all(batch);
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

// ─── ADMIN MANAGEMENT ────────────────────────────────────────────────────────

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  createdBy?: string;
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AdminUser));
}

export async function addAdmin(uid: string, email: string, displayName?: string, createdBy?: string): Promise<void> {
  await setDoc(doc(db, "admins", uid), {
    uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
    createdBy,
  });
}

export async function removeAdmin(uid: string): Promise<void> {
  await deleteDoc(doc(db, "admins", uid));
}
