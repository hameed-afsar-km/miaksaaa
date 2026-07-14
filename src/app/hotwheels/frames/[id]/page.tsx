"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Frame, ShoppingBag, ChevronLeft, ChevronRight,
  Check, Plus, Minus, Flame,
} from "lucide-react";
import {
  getFrameProductById,
  getFramePositions,
  getFrameBackgrounds,
  getFrameSizes,
  getFramableProducts,
} from "@/lib/firebase/firestore";
import {
  FrameProduct as FrameProductType,
  FramePosition,
  FrameBackground,
  FrameSize,
  Product,
} from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import toast from "react-hot-toast";

type Step = "car" | "position" | "background" | "size" | "review";

const STEPS: { key: Step; label: string }[] = [
  { key: "car", label: "Choose Car" },
  { key: "position", label: "Position" },
  { key: "background", label: "Background" },
  { key: "size", label: "Size" },
];

export default function FrameConfiguratorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();

  const [frameProduct, setFrameProduct] = useState<FrameProductType | null>(null);
  const [positions, setPositions] = useState<FramePosition[]>([]);
  const [backgrounds, setBackgrounds] = useState<FrameBackground[]>([]);
  const [sizes, setSizes] = useState<FrameSize[]>([]);
  const [cars, setCars] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [step, setStep] = useState<Step>("car");
  const [selectedCar, setSelectedCar] = useState<Product | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<FramePosition | null>(null);
  const [selectedBg, setSelectedBg] = useState<FrameBackground | null>(null);
  const [selectedSize, setSelectedSize] = useState<FrameSize | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getFrameProductById(id as string),
      getFramePositions(),
      getFrameBackgrounds(),
      getFrameSizes(),
      getFramableProducts(),
    ]).then(([fp, pos, bg, sz, crs]) => {
      if (!fp) { router.push("/hotwheels/frames"); return; }
      setFrameProduct(fp);
      setPositions(pos.filter((p) => fp.enabledPositionIds?.includes(p.id)));
      setBackgrounds(bg.filter((b) => fp.enabledBackgroundIds?.includes(b.id)));
      setSizes(sz.filter((s) => fp.enabledSizeIds?.includes(s.id)));
      setCars(crs);
      if (pos.length > 0 && fp.enabledPositionIds?.includes(pos[0].id)) setSelectedPosition(pos[0]);
      if (bg.length > 0 && fp.enabledBackgroundIds?.includes(bg[0].id)) setSelectedBg(bg[0]);
      if (sz.length > 0 && fp.enabledSizeIds?.includes(sz[0].id)) setSelectedSize(sz[0]);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, router]);

  // Calculate price
  const calcPrice = () => {
    if (!frameProduct) return 0;
    let price = frameProduct.basePrice;

    if (selectedPosition) {
      const override = frameProduct.positionPriceOverrides?.[selectedPosition.id];
      price += override ?? selectedPosition.x ? 0 : 0; // positions may have premium built into override
    }
    if (selectedBg) {
      const override = frameProduct.backgroundPriceOverrides?.[selectedBg.id];
      price += override ?? selectedBg.priceAdjustment;
    }
    if (selectedSize) {
      const override = frameProduct.sizePriceOverrides?.[selectedSize.id];
      price += override ?? selectedSize.priceAdjustment;
    }

    return price;
  };

  const totalPrice = calcPrice();

  const canAddToCart = selectedCar && selectedPosition && selectedBg && selectedSize;

  const handleAddToCart = () => {
    if (!canAddToCart || !frameProduct) return;
    const customization = {
      frameProductId: frameProduct.id,
      frameTitle: frameProduct.title,
      frameImage: frameProduct.images[0] || "",
      selectedCarId: selectedCar.id,
      selectedCarTitle: selectedCar.title,
      selectedCarImage: selectedCar.images[0] || "",
      selectedPositionId: selectedPosition.id,
      selectedPositionLabel: selectedPosition.label,
      selectedBackgroundId: selectedBg.id,
      selectedBackgroundLabel: selectedBg.label,
      selectedBackgroundImage: selectedBg.imageUrl,
      selectedSizeId: selectedSize.id,
      selectedSizeLabel: selectedSize.label,
      selectedSizeWidth: selectedSize.width,
      selectedSizeHeight: selectedSize.height,
    };

    addToCart({
      productId: `frame_${frameProduct.id}`,
      title: `Custom Frame: ${frameProduct.title} (${selectedCar.title})`,
      price: totalPrice,
      discountedPrice: frameProduct.discountedPrice,
      image: frameProduct.images[0] || "",
      quantity: 1,
      stock: 999,
      category: "Custom Frames",
      itemType: "custom-frame",
      frameCustomization: customization,
    });
    toast.success("Custom frame added to cart!");
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="container-lg py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-[4/5] skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 w-1/3 skeleton" />
            <div className="h-10 w-2/3 skeleton" />
            <div className="h-8 w-1/4 skeleton" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (!frameProduct) return null;

  return (
    <div style={{ background: "#0D0200", minHeight: "100vh" }}>
      <div className="container-lg py-8">
        {/* Back */}
        <button onClick={() => router.back()}
          className="flex items-center gap-1 text-sm font-bold mb-6 transition-colors hover:text-[#FF6600]"
          style={{ color: "#cc9980" }}>
          <ChevronLeft size={16} /> Back to Frames
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ─── LEFT: Live Preview ─── */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="text-center">
              <h2 className="text-lg font-black" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                LIVE PREVIEW
              </h2>
              <p className="text-xs" style={{ color: "#cc9980" }}>Changes update in real time</p>
            </div>

            {/* Preview composite */}
            <div className="relative rounded-2xl overflow-hidden mx-auto"
              style={{
                width: "100%",
                maxWidth: selectedSize ? `${Math.min(selectedSize.width * 20, 400)}px` : "300px",
                aspectRatio: selectedSize ? `${selectedSize.width}/${selectedSize.height}` : "3/4",
                background: "#0D0200",
                border: "2px solid rgba(255,68,0,0.2)",
              }}
            >
              {/* Layer 1: Background */}
              {selectedBg && (
                <Image
                  src={selectedBg.imageUrl}
                  alt={selectedBg.label}
                  fill
                  className="object-cover"
                  priority
                />
              )}

              {/* Layer 2: Car */}
              {selectedCar && selectedPosition && (
                <div
                  className="absolute"
                  style={{
                    top: `${selectedPosition.y}%`,
                    left: `${selectedPosition.x}%`,
                    transform: `translate(-50%, -50%) rotate(${selectedPosition.rotation}deg) scale(${selectedPosition.carScale})`,
                    width: "40%",
                    height: "40%",
                  }}
                >
                  <Image
                    src={selectedCar.images[0] || ""}
                    alt={selectedCar.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              )}

              {/* Layer 3: Frame */}
              {frameProduct.images[0] && (
                <Image
                  src={frameProduct.images[0]}
                  alt={frameProduct.title}
                  fill
                  className="object-contain pointer-events-none relative z-10"
                />
              )}

              {/* Watermark if no car selected */}
              {!selectedCar && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center">
                    <Frame size={48} className="mx-auto mb-2" style={{ color: "rgba(255,68,0,0.3)" }} />
                    <p className="text-sm font-bold" style={{ color: "rgba(255,68,0,0.3)" }}>Select a car</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price display */}
            <div className="text-center p-4 rounded-xl"
              style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.12)" }}>
              <p className="text-xs uppercase tracking-wider font-bold mb-1" style={{ color: "#cc9980" }}>Total Price</p>
              <p className="text-3xl font-black" style={{ color: "#FF4400" }}>
                {formatPrice(totalPrice)}
              </p>
              {frameProduct.discountedPrice && (
                <p className="text-xs line-through mt-1" style={{ color: "#cc9980" }}>
                  {formatPrice(frameProduct.basePrice)}
                </p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                  color: "#fff",
                  boxShadow: "0 0 20px rgba(255,68,0,0.3)",
                }}
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
          </div>

          {/* ─── RIGHT: Configurator Steps ─── */}
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, i) => {
                const isActive = step === s.key;
                const isDone = (s.key === "car" && selectedCar) ||
                  (s.key === "position" && selectedPosition) ||
                  (s.key === "background" && selectedBg) ||
                  (s.key === "size" && selectedSize);
                return (
                  <button key={s.key} onClick={() => setStep(s.key)}
                    className="flex items-center gap-2 transition-all"
                    style={{ flex: 1 }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          background: isDone
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : isActive
                            ? "linear-gradient(135deg, #FF4400, #D32F2F)"
                            : "rgba(255,255,255,0.06)",
                          color: isDone || isActive ? "#fff" : "#cc9980",
                        }}>
                        {isDone ? <Check size={14} /> : i + 1}
                      </div>
                      <span className={`text-xs font-bold hidden sm:block ${isActive ? "text-[#FF6600]" : "text-[#cc9980]"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px mx-1"
                        style={{ background: isDone ? "#22c55e" : "rgba(255,68,0,0.15)" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ─── Step 1: Choose Car ─── */}
            {step === "car" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  SELECT A <span style={{ color: "#FF4400" }}>CAR</span>
                </h3>
                {cars.length === 0 ? (
                  <p className="text-sm" style={{ color: "#cc9980" }}>No cars available for framing yet. Admin needs to mark products as framable.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {cars.map((car) => {
                      const isSelected = selectedCar?.id === car.id;
                      return (
                        <button key={car.id} onClick={() => { setSelectedCar(car); setStep("position"); }}
                          className="text-left p-3 rounded-xl border transition-all"
                          style={{
                            background: isSelected ? "rgba(255,68,0,0.12)" : "#1A0500",
                            borderColor: isSelected ? "#FF4400" : "rgba(255,68,0,0.12)",
                          }}>
                          <div className="aspect-square rounded-lg overflow-hidden bg-[#0D0200] mb-2 relative">
                            {car.images[0] ? (
                              <Image src={car.images[0]} alt={car.title} fill className="object-contain" />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ShoppingBag size={20} style={{ color: "rgba(255,68,0,0.2)" }} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-bold truncate" style={{ color: "#FFE0CC" }}>{car.title}</p>
                          <p className="text-xs" style={{ color: "#cc9980" }}>
                            {car.scale && `${car.scale} `}{car.condition && `• ${car.condition}`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Step 2: Position ─── */}
            {step === "position" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  CHOOSE <span style={{ color: "#FF4400" }}>POSITION</span>
                </h3>
                {positions.length === 0 ? (
                  <p className="text-sm" style={{ color: "#cc9980" }}>No positions configured. Admin needs to set up positions.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {positions.map((pos) => {
                      const isSelected = selectedPosition?.id === pos.id;
                      return (
                        <button key={pos.id} onClick={() => { setSelectedPosition(pos); setStep("background"); }}
                          className="text-center p-4 rounded-xl border transition-all"
                          style={{
                            background: isSelected ? "rgba(255,68,0,0.12)" : "#1A0500",
                            borderColor: isSelected ? "#FF4400" : "rgba(255,68,0,0.12)",
                          }}>
                          {/* Mini preview */}
                          <div className="aspect-square rounded-lg overflow-hidden bg-[#0D0200] mb-2 relative">
                            {selectedCar ? (
                              <div className="absolute" style={{
                                top: `${pos.y}%`,
                                left: `${pos.x}%`,
                                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${pos.carScale * 0.8})`,
                                width: "50%",
                                height: "50%",
                              }}>
                                {selectedCar.images[0] && (
                                  <Image src={selectedCar.images[0]} alt="" fill className="object-contain" />
                                )}
                              </div>
                            ) : null}
                          </div>
                          <p className="text-sm font-bold" style={{ color: isSelected ? "#FF6600" : "#FFE0CC" }}>
                            {pos.label}
                          </p>
                          {frameProduct.positionPriceOverrides?.[pos.id] ? (
                            <p className="text-xs" style={{ color: "#cc9980" }}>
                              +{formatPrice(frameProduct.positionPriceOverrides[pos.id])}
                            </p>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Step 3: Background ─── */}
            {step === "background" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  PICK A <span style={{ color: "#FF4400" }}>BACKGROUND</span>
                </h3>
                {backgrounds.length === 0 ? (
                  <p className="text-sm" style={{ color: "#cc9980" }}>No backgrounds configured. Admin needs to add background images.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {backgrounds.map((bg) => {
                      const isSelected = selectedBg?.id === bg.id;
                      return (
                        <button key={bg.id} onClick={() => { setSelectedBg(bg); setStep("size"); }}
                          className="text-center p-3 rounded-xl border transition-all"
                          style={{
                            background: isSelected ? "rgba(255,68,0,0.12)" : "#1A0500",
                            borderColor: isSelected ? "#FF4400" : "rgba(255,68,0,0.12)",
                          }}>
                          <div className="aspect-video rounded-lg overflow-hidden mb-2 relative">
                            <Image src={bg.imageUrl} alt={bg.label} fill className="object-cover" />
                          </div>
                          <p className="text-sm font-bold" style={{ color: isSelected ? "#FF6600" : "#FFE0CC" }}>
                            {bg.label}
                          </p>
                          {bg.priceAdjustment > 0 && (
                            <p className="text-xs" style={{ color: "#cc9980" }}>+{formatPrice(bg.priceAdjustment)}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Step 4: Size ─── */}
            {step === "size" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  SELECT <span style={{ color: "#FF4400" }}>SIZE</span>
                </h3>
                {sizes.length === 0 ? (
                  <p className="text-sm" style={{ color: "#cc9980" }}>No sizes configured. Admin needs to set up size options.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {sizes.map((sz) => {
                      const isSelected = selectedSize?.id === sz.id;
                      return (
                        <button key={sz.id} onClick={() => { setSelectedSize(sz); setStep("review"); }}
                          className="text-center p-5 rounded-xl border transition-all"
                          style={{
                            background: isSelected ? "rgba(255,68,0,0.12)" : "#1A0500",
                            borderColor: isSelected ? "#FF4400" : "rgba(255,68,0,0.12)",
                          }}>
                          <div className="w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center"
                            style={{
                              background: "rgba(255,68,0,0.06)",
                              border: "1px solid rgba(255,68,0,0.12)",
                              aspectRatio: `${sz.width}/${sz.height}`,
                            }}>
                            <span className="text-lg font-black" style={{ color: "#FF6600" }}>
                              {sz.label}
                            </span>
                          </div>
                          <p className="text-sm font-bold" style={{ color: "#FFE0CC" }}>
                            {sz.label}
                          </p>
                          <p className="text-xs" style={{ color: "#cc9980" }}>
                            {sz.width} × {sz.height} in
                          </p>
                          {sz.priceAdjustment > 0 && (
                            <p className="text-xs font-bold" style={{ color: "#FF6600" }}>
                              +{formatPrice(sz.priceAdjustment)}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Step 5: Review ─── */}
            {step === "review" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl space-y-4"
                style={{ background: "#1A0500", border: "1px solid rgba(255,68,0,0.12)" }}>
                <h3 className="text-xl font-black mb-4" style={{ fontFamily: "Impact, sans-serif", color: "#FFE0CC" }}>
                  REVIEW YOUR <span style={{ color: "#FF4400" }}>FRAME</span>
                </h3>

                <div className="space-y-3">
                  <ReviewItem label="Frame" value={frameProduct.title} />
                  <ReviewItem label="Car" value={selectedCar?.title || "Not selected"} />
                  <ReviewItem label="Position" value={selectedPosition?.label || "Not selected"} />
                  <ReviewItem label="Background" value={selectedBg?.label || "Not selected"} />
                  <ReviewItem label="Size" value={selectedSize ? `${selectedSize.label} (${selectedSize.width} × ${selectedSize.height} in)` : "Not selected"} />
                </div>

                <div className="pt-4 border-t" style={{ borderColor: "rgba(255,68,0,0.1)" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold" style={{ color: "#cc9980" }}>Total</span>
                    <span className="text-2xl font-black" style={{ color: "#FF4400" }}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {STEPS.map((s) => (
                    <button key={s.key} onClick={() => setStep(s.key)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: "rgba(255,68,0,0.06)",
                        color: "#cc9980",
                        border: "1px solid rgba(255,68,0,0.12)",
                      }}>
                      Edit {s.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              {step !== "car" && (
                <button onClick={() => {
                  const idx = STEPS.findIndex((s) => s.key === step);
                  if (idx > 0) setStep(STEPS[idx - 1].key);
                }}
                  className="flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#cc9980",
                    border: "1px solid rgba(255,68,0,0.12)",
                  }}>
                  <ChevronLeft size={16} /> Previous
                </button>
              )}
              {step !== "review" && (
                <button onClick={() => {
                  const idx = STEPS.findIndex((s) => s.key === step);
                  if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].key);
                }}
                  className="flex items-center gap-1 px-5 py-3 rounded-xl text-sm font-bold transition-all ml-auto"
                  style={{
                    background: "linear-gradient(135deg, #FF4400, #D32F2F)",
                    color: "#fff",
                  }}>
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b"
      style={{ borderColor: "rgba(255,68,0,0.06)" }}>
      <span className="text-xs uppercase font-bold tracking-wider" style={{ color: "#cc9980" }}>{label}</span>
      <span className="text-sm font-bold text-right" style={{ color: "#FFE0CC" }}>{value}</span>
    </div>
  );
}
