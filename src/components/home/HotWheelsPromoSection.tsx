"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Zap, Trophy, Star } from "lucide-react";

const EMBERS = [
  { x: 5, s: 2, d: 0, dur: 4 },  { x: 12, s: 3, d: 0.6, dur: 5 }, { x: 20, s: 2, d: 1.2, dur: 4 },
  { x: 28, s: 4, d: 1.8, dur: 6 }, { x: 35, s: 2, d: 2.4, dur: 5 }, { x: 42, s: 3, d: 3.0, dur: 4 },
  { x: 50, s: 2, d: 0.3, dur: 5 }, { x: 57, s: 4, d: 0.9, dur: 6 }, { x: 63, s: 3, d: 1.5, dur: 4 },
  { x: 70, s: 2, d: 2.1, dur: 5 }, { x: 76, s: 3, d: 2.7, dur: 6 }, { x: 82, s: 4, d: 3.3, dur: 4 },
  { x: 88, s: 2, d: 0.4, dur: 5 }, { x: 15, s: 3, d: 1.0, dur: 6 }, { x: 45, s: 2, d: 1.6, dur: 4 },
  { x: 60, s: 4, d: 2.2, dur: 5 }, { x: 33, s: 3, d: 2.8, dur: 6 }, { x: 78, s: 2, d: 3.4, dur: 4 },
  { x: 8, s: 3, d: 0.7, dur: 5 },  { x: 55, s: 4, d: 1.3, dur: 6 },
];

function EmberParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {EMBERS.map((e, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${e.s}px`,
            height: `${e.s}px`,
            left: `${e.x}%`,
            bottom: "-5%",
            background: i % 4 === 0 ? "#FF4400" : i % 4 === 1 ? "#FFD600" : i % 4 === 2 ? "#FF6600" : "#D32F2F",
            animation: `${i % 3 === 0 ? "emberRiseAlt" : "emberRise"} ${e.dur}s ${e.d}s ease-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

function DiagonalStripes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(5)].map((_, i) => (
        <div key={i}
          className="absolute"
          style={{
            width: "200%",
            height: "2px",
            left: "-50%",
            top: `${18 + i * 16}%`,
            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "rgba(255,68,0,0.06)" : "rgba(255,214,0,0.04)"}, transparent)`,
            transform: `rotate(${-5 + i * 2}deg)`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

function GlowOrbs() {
  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[400px] h-[350px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #FF4400, transparent 65%)", filter: "blur(100px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[15%] right-[15%] w-[350px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #FFD600, transparent 65%)", filter: "blur(90px)" }}
      />
    </>
  );
}

export function HotWheelsPromoSection() {
  const headlineWords = ["FUEL", "YOUR", "DIE-CAST", "OBSESSION"];

  return (
    <>
      <style>{`
        .hw-burnout {
          background: #0a0200;
          height: 100vh;
          height: 100dvh;
        }
        @keyframes emberRise {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-110vh) translateX(20px) scale(0.3); opacity: 0; }
        }
        @keyframes emberRiseAlt {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-110vh) translateX(-20px) scale(0.3); opacity: 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes burnPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,68,0,0.3)) drop-shadow(0 0 40px rgba(255,68,0,0.15)); }
          50% { filter: drop-shadow(0 0 35px rgba(255,68,0,0.5)) drop-shadow(0 0 60px rgba(255,68,0,0.25)); }
        }
        @keyframes borderBurn {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        .hw-btn-fire {
          background: linear-gradient(135deg, #FF4400, #D32F2F);
          box-shadow: 0 4px 24px rgba(255,68,0,0.35);
          position: relative;
        }
        .hw-btn-fire::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(90deg, #FF4400, #FFD600, #FF4400, #D32F2F, #FF4400);
          background-size: 200% 100%;
          animation: borderBurn 2s linear infinite;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .hw-btn-fire:hover::before { opacity: 1; }
        .hw-btn-fire:hover {
          box-shadow: 0 8px 40px rgba(255,68,0,0.55);
          transform: translateY(-2px);
        }
      `}</style>

      <section className="relative overflow-hidden flex flex-col hw-burnout">

        <EmberParticles />
        <DiagonalStripes />
        <GlowOrbs />

        {/* ── Top marquee ── */}
        <div className="relative shrink-0 z-20">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #FF4400, transparent 40%, transparent 60%, #FFD600)", filter: "blur(30px)" }} />
          <div className="relative overflow-hidden whitespace-nowrap py-2.5">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #0a0200, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #0a0200, transparent)" }} />
            <div className="flex gap-6" style={{
              width: "max-content",
              animation: "marqueeScroll 28s linear infinite",
            }}>
              {[...Array(3)].map((_, set) =>
                ["TREASURE HUNT", "SUPER TH", "RARE", "1:64 SCALE", "PREMIUM", "CUSTOMS", "TH", "NEW ARRIVALS", "COLLECTOR", "DIE-CAST", "WILDCARD", "ULTRA HOT", "FORGOTTEN", "FLAME", "TRACK"].map((word, i) => (
                  <span key={`${set}-${i}`} className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                      style={{ color: i % 3 === 0 ? "#FF4400" : i % 3 === 1 ? "#FFD600" : "#FF6600" }}>
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: i % 2 === 0 ? "rgba(255,68,0,0.5)" : "rgba(255,214,0,0.4)" }} />
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="relative z-20 flex-1 flex flex-col overflow-hidden">

          {/* ═══════════ MOBILE ═══════════ */}
          <div className="lg:hidden flex-1 flex flex-col items-center justify-center px-5 gap-4 text-center">

            {/* Logo with burning border */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 -m-4 pointer-events-none"
                style={{ animation: "spinRing 10s linear infinite" }}>
                <div className="w-full h-full rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #FF4400 20%, transparent 40%, #FFD600 60%, transparent 80%, #FF4400 100%)",
                    filter: "blur(18px)", opacity: 0.3,
                  }} />
              </div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ animation: "burnPulse 3s ease-in-out infinite" }}
              >
                <Image src="/hw_logo.png" alt="HotWheels" width={320} height={320}
                  className="object-contain w-72 h-72 sm:w-80 sm:h-80 relative z-10" priority={false} />
              </motion.div>
            </motion.div>

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-2 justify-center"
            >
              <span className="w-6 h-px" style={{ background: "rgba(255,68,0,0.4)" }} />
              <Flame size={12} className="text-[#FF4400]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Die-Cast Collection</span>
              <Flame size={12} className="text-[#FF4400]" />
              <span className="w-6 h-px" style={{ background: "rgba(255,68,0,0.4)" }} />
            </motion.div>

            {/* Headline */}
            <h2 className="text-[1.75rem] sm:text-3xl font-black leading-[1.05]"
              style={{ fontFamily: "Impact, sans-serif" }}>
              {headlineWords.map((word, i) => (
                <motion.span key={word}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-2"
                  style={i >= 2 ? {
                    background: "linear-gradient(90deg, #FF4400, #FFD600, #FF4400)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "gradientShift 3s linear infinite",
                  } : { color: "#FFE0CC" }}
                >{word}</motion.span>
              ))}
            </h2>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.4 }}
              className="flex gap-5 justify-center"
            >
              {[
                { icon: Trophy, v: "500+", l: "Finds" },
                { icon: Star, v: "2K+", l: "Collectors" },
                { icon: Zap, v: "Weekly", l: "Drops" },
              ].map(({ icon: Icon, v, l }) => (
                <div key={l} className="flex items-center gap-1.5">
                  <Icon size={11} style={{ color: "#FF6600" }} />
                  <div>
                    <p className="text-[11px] font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                    <p className="text-[8px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Subtext */}
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-xs max-w-xs leading-relaxed"
              style={{ color: "rgba(204,153,128,0.7)" }}
            >Treasure hunts · Super treasure hunts · Rare customs · Premium die-cast</motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.4 }}
              className="flex flex-col w-full max-w-xs gap-2.5"
            >
              <Link href="/hotwheels"
                className="hw-btn-fire group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-white overflow-hidden transition-all active:scale-95">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                <span className="relative z-10">Enter HotWheels</span>
                <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/hotwheels/products"
                className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold overflow-hidden transition-all active:scale-95"
                style={{ color: "#FF6600", border: "1.5px solid rgba(255,68,0,0.2)" }}>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(255,68,0,0.08)" }} />
                <span className="relative z-10">Browse All Cars</span>
              </Link>
            </motion.div>
          </div>

          {/* ═══════════ DESKTOP ═══════════ */}
          <div className="hidden lg:flex flex-1 items-center container-lg px-8 xl:px-12">

            {/* Left — Text */}
            <div className="flex-1 text-left pr-12">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="flex items-center gap-2.5 mb-5"
              >
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{ background: "rgba(255,68,0,0.15)", border: "1px solid rgba(255,68,0,0.3)" }}>
                  <Flame size={14} className="text-[#FF4400]" />
                </motion.div>
                <span className="w-6 h-px" style={{ background: "rgba(255,68,0,0.3)" }} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#FF6600]">Die-Cast Collection</span>
              </motion.div>

              <h2 className="text-4xl xl:text-[3.5rem] font-black leading-[1.05] mb-5"
                style={{ fontFamily: "Impact, sans-serif" }}>
                {headlineWords.map((word, i) => (
                  <motion.span key={word}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block mr-3"
                    style={i >= 2 ? {
                      background: "linear-gradient(90deg, #FF4400, #FFD600, #FF4400)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      animation: "gradientShift 3s linear infinite",
                    } : { color: "#FFE0CC" }}
                  >{word}</motion.span>
                ))}
              </h2>

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}
                className="flex gap-6 mb-5"
              >
                {[
                  { icon: Trophy, v: "500+", l: "Rare Finds" },
                  { icon: Star, v: "2K+", l: "Collectors" },
                  { icon: Zap, v: "Weekly", l: "New Drops" },
                ].map(({ icon: Icon, v, l }) => (
                  <div key={l} className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "#FF6600" }} />
                    <div>
                      <p className="text-xs font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.5 }}
                className="text-sm max-w-md mb-7 leading-relaxed"
                style={{ color: "#cc9980" }}
              >
                Treasure hunts, super treasure hunts, rare customs, and premium die-cast.
                <span className="text-[#FF6600] font-bold"> Explore the full collection.</span>
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.5 }}
                className="flex gap-3"
              >
                <Link href="/hotwheels"
                  className="hw-btn-fire group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-black text-white overflow-hidden transition-all active:scale-95">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                  <span className="relative z-10">Enter HotWheels</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/hotwheels/products"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold overflow-hidden transition-all active:scale-95"
                  style={{ color: "#FF6600", border: "1.5px solid rgba(255,68,0,0.2)" }}>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(255,68,0,0.08)" }} />
                  <span className="relative z-10">Browse All Cars</span>
                </Link>
              </motion.div>
            </div>

            {/* Right — Logo with burning effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              {/* Spinning conic glow */}
              <div className="absolute inset-0 -m-8 pointer-events-none"
                style={{ animation: "spinRing 10s linear infinite" }}>
                <div className="w-full h-full rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #FF4400 15%, transparent 30%, #FFD600 50%, transparent 65%, #FF4400 85%, transparent 100%)",
                    filter: "blur(22px)", opacity: 0.3,
                  }} />
              </div>
              <div className="absolute inset-0 -m-12 pointer-events-none"
                style={{ animation: "spinRing 14s linear infinite reverse" }}>
                <div className="w-full h-full rounded-full"
                  style={{ border: "1px dashed rgba(255,68,0,0.12)" }} />
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ animation: "burnPulse 3s ease-in-out infinite" }}
              >
                <Image src="/hw_logo.png" alt="HotWheels" width={500} height={500}
                  className="object-contain w-[30rem] h-[30rem] md:w-[34rem] md:h-[34rem] relative z-10" priority={false} />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Bottom marquee ── */}
        <div className="relative shrink-0 z-20">
          <div className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #FFD600, transparent 40%, transparent 60%, #FF4400)", filter: "blur(30px)" }} />
          <div className="relative overflow-hidden whitespace-nowrap py-2.5">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #0a0200, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #0a0200, transparent)" }} />
            <div className="flex gap-6" style={{
              width: "max-content",
              animation: "marqueeScroll 32s linear infinite reverse",
            }}>
              {[...Array(3)].map((_, set) =>
                ["TREASURE HUNT", "SUPER TH", "RARE", "1:64 SCALE", "PREMIUM", "CUSTOMS", "TH", "NEW ARRIVALS", "COLLECTOR", "DIE-CAST", "WILDCARD", "ULTRA HOT", "FORGOTTEN", "FLAME", "TRACK"].map((word, i) => (
                  <span key={`b-${set}-${i}`} className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                      style={{ color: i % 3 === 0 ? "#FF4400" : i % 3 === 1 ? "#FFD600" : "#FF6600" }}>
                      {word}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: i % 2 === 0 ? "rgba(255,68,0,0.5)" : "rgba(255,214,0,0.4)" }} />
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-30"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg-dark))" }} />

        {/* Shared keyframes */}
        <style>{`
          @keyframes marqueeScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>
    </>
  );
}
