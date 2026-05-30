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
  runTransaction,
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
  Review,
  ColorVariant,
  SizeVariant,
} from "@/lib/types";

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// Cache visible products across server component requests in the same render
function getVisibleProductsRawCache(): Promise<Product[]> {
  return getVisibleProductsRaw();
}

async function getVisibleProductsRaw(): Promise<Product[]> {
  try {
    const snap = await getDocs(query(collection(db, "products"), where("isVisible", "==", true)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

// Single fetch that derives featured/new/hot to eliminate redundant reads
export async function getHomepageProducts(): Promise<{
  featured: Product[];
  newArrivals: Product[];
  hot: Product[];
}> {
  const products = await getVisibleProductsRaw();
  const sorted = [...products].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds || 0;
    const bTime = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds || 0;
    return bTime - aTime;
  });
  return {
    featured: products.filter((p) => p.isFeatured).slice(0, 8),
    newArrivals: sorted.filter((p) => p.isNew).slice(0, 8),
    hot: products.filter((p) => p.isHot).slice(0, 8),
  };
}

export async function getAllProducts(maxCount?: number): Promise<Product[]> {
  const q = maxCount
    ? query(collection(db, "products"), where("isVisible", "==", true), limit(maxCount))
    : query(collection(db, "products"), where("isVisible", "==", true));
  const snap = await getDocs(q);
  const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
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

export async function getSimilarProducts(
  category: string,
  excludeId: string,
  maxCount: number = 4
): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", category),
      where("isVisible", "==", true),
      limit(maxCount + 1)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as Product))
      .filter((p) => p.id !== excludeId)
      .slice(0, maxCount);
  } catch (err) {
    console.error("Failed to fetch similar products:", err);
    return [];
  }
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

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt.toDate() > now) {
    return {
      valid: false,
      message: `Coupon starts on ${coupon.startsAt.toDate().toLocaleDateString()}`,
    };
  }

  if (coupon.expiresAt && coupon.expiresAt.toDate() < now) {
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

export async function getAvailableCoupons(): Promise<Coupon[]> {
  const snap = await getDocs(collection(db, "coupons"));
  const now = new Date();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Coupon))
    .filter((c) => {
      if (!c.isActive) return false;
      if (!c.isVisible) return false;
      if (c.startsAt && c.startsAt.toDate() > now) return false;
      if (c.expiresAt && c.expiresAt.toDate() < now) return false;
      if (c.usedCount >= c.maxUses) return false;
      return true;
    });
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

      if (item.selectedColor || item.selectedSize) {
        await runTransaction(db, async (transaction) => {
          const snap = await transaction.get(productRef);
          if (!snap.exists()) return;

          const data = snap.data();
          const updates: Record<string, any> = {
            stock: increment(-item.quantity),
          };

          if (item.selectedColor && data.colorVariants) {
            updates.colorVariants = data.colorVariants.map((v: ColorVariant) =>
              v.name === item.selectedColor
                ? { ...v, stock: Math.max(0, v.stock - item.quantity) }
                : v
            );
          }

          if (item.selectedSize && data.sizeVariants) {
            updates.sizeVariants = data.sizeVariants.map((v: SizeVariant) =>
              v.size === item.selectedSize
                ? { ...v, stock: Math.max(0, v.stock - item.quantity) }
                : v
            );
          }

          transaction.update(productRef, updates);
        });
      } else {
        await updateDoc(productRef, {
          stock: increment(-item.quantity),
        });
      }
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

export async function getUserOrders(userId: string, maxCount?: number): Promise<Order[]> {
  const constraints: any[] = [where("userId", "==", userId), orderBy("createdAt", "desc")];
  if (maxCount) constraints.push(limit(maxCount));
  const snap = await getDocs(query(collection(db, "orders"), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(maxCount?: number): Promise<Order[]> {
  const constraints: any[] = [orderBy("createdAt", "desc")];
  if (maxCount) constraints.push(limit(maxCount));
  const snap = await getDocs(query(collection(db, "orders"), ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<void> {
  const orderRef = doc(db, "orders", id);
  const isCancelled = status === "cancelled by user" || status === "cancelled by admin";

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(orderRef);
      if (!snap.exists()) return;

      const oldStatus = snap.data().status;
      const alreadyCancelled = oldStatus === "cancelled by user" || oldStatus === "cancelled by admin";

      // If already cancelled, don't restore stock again
      if (isCancelled && !alreadyCancelled) {
        const items = snap.data().items || [];
        for (const item of items) {
          const productRef = doc(db, "products", item.productId);

          if (item.selectedColor || item.selectedSize) {
            const productSnap = await transaction.get(productRef);
            if (!productSnap.exists()) continue;

            const productData = productSnap.data();
            const updates: Record<string, any> = {
              stock: increment(item.quantity),
            };

            if (item.selectedColor && productData.colorVariants) {
              updates.colorVariants = productData.colorVariants.map((v: ColorVariant) =>
                v.name === item.selectedColor
                  ? { ...v, stock: v.stock + item.quantity }
                  : v
              );
            }

            if (item.selectedSize && productData.sizeVariants) {
              updates.sizeVariants = productData.sizeVariants.map((v: SizeVariant) =>
                v.size === item.selectedSize
                  ? { ...v, stock: v.stock + item.quantity }
                  : v
              );
            }

            transaction.update(productRef, updates);
          } else {
            transaction.update(productRef, {
              stock: increment(item.quantity),
            });
          }
        }
      }

      transaction.update(orderRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    });
  } catch (err) {
    console.error("Failed to update order status:", err);
    throw err;
  }
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

export async function deleteAllOrders(): Promise<void> {
  const snap = await getDocs(collection(db, "orders"));
  const batch = snap.docs.map((d) => deleteDoc(doc(db, "orders", d.id)));
  await Promise.all(batch);
}

export async function updateOrderUTR(
  orderId: string,
  utr: string
): Promise<void> {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    utr,
    status: "waiting",
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

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

export async function addReview(
  productId: string,
  userId: string,
  userName: string,
  userPhotoURL: string | null,
  rating: number,
  comment: string
): Promise<void> {
  await addDoc(collection(db, "reviews"), {
    productId,
    userId,
    userName,
    userPhotoURL,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
  await updateProductRating(productId);
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("productId", "==", productId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function updateProductRating(productId: string): Promise<void> {
  const reviewsSnap = await getDocs(
    query(collection(db, "reviews"), where("productId", "==", productId))
  );
  const reviewCount = reviewsSnap.size;
  let rating = 0;
  if (reviewCount > 0) {
    const total = reviewsSnap.docs.reduce(
      (sum, d) => sum + (d.data().rating || 0),
      0
    );
    rating = Math.round((total / reviewCount) * 10) / 10;
  }
  await updateDoc(doc(db, "products", productId), {
    rating,
    reviewCount,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteReview(reviewId: string, productId: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", reviewId));
  await updateProductRating(productId);
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
}

export async function updateReview(
  reviewId: string,
  productId: string,
  rating: number,
  comment: string
): Promise<void> {
  await updateDoc(doc(db, "reviews", reviewId), {
    rating,
    comment,
  });
  await updateProductRating(productId);
}
