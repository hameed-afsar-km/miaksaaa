"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/layout/LenisProvider";

const SNAP_THRESHOLD = 0.7;

export function useScrollSnap(containerSelector = "[data-snap]") {
  const lenis = useLenis();
  const snappingRef = useRef(false);

  useEffect(() => {
    if (!lenis) return;

    let scrollTimer: ReturnType<typeof setTimeout>;

    function getSections(): Element[] {
      return Array.from(document.querySelectorAll(containerSelector));
    }

    function getMostVisibleSection(sections: Element[]): {
      element: Element;
      ratio: number;
    } | null {
      let best: { element: Element; ratio: number } | null = null;
      const vh = window.innerHeight;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const visibleHeight =
          Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
        const ratio = visibleHeight / vh;

        if (!best || ratio > best.ratio) {
          best = { element: section, ratio };
        }
      }

      return best;
    }

    const lenisInstance = lenis;

    function onScroll() {
      if (snappingRef.current) return;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (snappingRef.current) return;

        const sections = getSections();
        if (sections.length === 0) return;

        const best = getMostVisibleSection(sections);
        if (best && best.ratio >= SNAP_THRESHOLD) {
          snappingRef.current = true;
          lenisInstance.scrollTo(best.element as HTMLElement, {
            offset: 0,
            duration: 1.6,
            easing: (t: number) =>
              Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          setTimeout(() => {
            snappingRef.current = false;
          }, 800);
        }
      }, 80);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [lenis, containerSelector]);
}
