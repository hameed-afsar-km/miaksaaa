"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageZoomProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ images, initialIndex = 0, isOpen, onClose }: ImageZoomProps) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const len = images.length;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + len) % len);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % len);
    }
    if (!isOpen) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.max(1, Math.min(6, s + delta)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isOpen) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isOpen]);

  function handlePointerDown(e: React.PointerEvent) {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  function handleDoubleClick() {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(3);
    }
  }

  const multiImage = images.length > 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex items-center justify-center select-none touch-pan-y"
            ref={containerRef}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="fixed top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.08)" }}
              aria-label="Close"
            >
              <X size={22} className="text-white" />
            </button>

            {/* Counter */}
            {multiImage && (
              <div className="fixed top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-medium text-white/70"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                {index + 1} / {images.length}
              </div>
            )}

            {/* Image */}
            <div
              ref={imgRef}
              className="relative w-full h-full flex items-center justify-center p-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[index]}
                alt=""
                draggable={false}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onDoubleClick={handleDoubleClick}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-out",
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  touchAction: "none",
                }}
                className="rounded-lg"
              />
            </div>

            {/* Nav arrows */}
            {multiImage && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setIndex((i) => (i - 1 + images.length) % images.length); }}
                  className="fixed left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={22} className="text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIndex((i) => (i + 1) % images.length); }}
                  className="fixed right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                  aria-label="Next"
                >
                  <ChevronRight size={22} className="text-white" />
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
