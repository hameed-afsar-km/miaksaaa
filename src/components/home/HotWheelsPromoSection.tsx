"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Zap, Trophy, Star } from "lucide-react";

function EnergyRings() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          border: "2px solid rgba(255,68,0,0.08)",
          boxShadow: "0 0 60px rgba(255,68,0,0.05) inset",
        }}
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          border: "1.5px solid rgba(255,214,0,0.06)",
          boxShadow: "0 0 40px rgba(255,214,0,0.04) inset",
        }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          border: "1px solid rgba(255,68,0,0.05)",
        }}
      />
    </div>
  );
}

function GlowingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        animate={{ x: [0, 80, -60, 0], y: [0, -40, 60, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,68,0,0.15) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ x: [0, -60, 80, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,214,0,0.1) 0%, transparent 70%)", filter: "blur(70px)" }}
      />
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -60, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-[60%] left-[60%] w-64 h-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,100,0,0.08) 0%, transparent 70%)", filter: "blur(50px)" }}
      />
    </div>
  );
}

function SparkLines() {
  const lines = [
    { x1: 5, y1: 20, angle: 25, len: 80, delay: 0 },
    { x1: 15, y1: 60, angle: -15, len: 120, delay: 0.8 },
    { x1: 30, y1: 35, angle: 40, len: 60, delay: 1.5 },
    { x1: 50, y1: 80, angle: -30, len: 100, delay: 0.3 },
    { x1: 70, y1: 25, angle: 20, len: 90, delay: 1.2 },
    { x1: 85, y1: 55, angle: -45, len: 70, delay: 2 },
    { x1: 92, y1: 40, angle: 10, len: 110, delay: 0.6 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: [0, 0.6, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: l.delay, repeat: Infinity, repeatDelay: 3 + i }}
          className="absolute h-px origin-left"
          style={{
            left: `${l.x1}%`,
            top: `${l.y1}%`,
            width: `${l.len}px`,
            transform: `rotate(${l.angle}deg)`,
            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "rgba(255,68,0,0.3)" : "rgba(255,214,0,0.25)"}, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

function FloatingEmbers() {
  const embers = [
    { x: 10, d: 0, dur: 5.5 }, { x: 25, d: 1.2, dur: 6.5 }, { x: 40, d: 0.5, dur: 5.8 },
    { x: 55, d: 1.8, dur: 6.2 }, { x: 70, d: 0.8, dur: 5.3 }, { x: 85, d: 2.2, dur: 6.8 },
    { x: 15, d: 2.8, dur: 5.2 }, { x: 35, d: 3.2, dur: 6.1 }, { x: 60, d: 0.3, dur: 5.7 },
    { x: 80, d: 1.5, dur: 6.4 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {embers.map((e, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${e.x}%`,
            bottom: "0%",
            background: i % 3 === 0 ? "#FF4400" : i % 3 === 1 ? "#FFD600" : "#FF6600",
            animation: `floatUp ${e.dur}s ${e.d}s ease-out infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export function HotWheelsPromoSection() {
  const headlineWords = ["FUEL", "YOUR", "DIE-CAST", "OBSESSION"];

  return (
    <>
      <style>{`
        .hw-bold {
          background: #080100;
          height: 100vh;
          height: 100dvh;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(0.2); opacity: 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes burnPulse {
          0%, 100% { filter: drop-shadow(0 0 25px rgba(255,68,0,0.35)) drop-shadow(0 0 50px rgba(255,68,0,0.15)); }
          50% { filter: drop-shadow(0 0 40px rgba(255,68,0,0.55)) drop-shadow(0 0 70px rgba(255,68,0,0.25)); }
        }
        @keyframes borderBurn {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(255,68,0,0.3), 0 0 60px rgba(255,68,0,0.1); }
          50% { box-shadow: 0 0 50px rgba(255,68,0,0.5), 0 0 100px rgba(255,68,0,0.2); }
        }
        .hw-btn-fire {
          background: linear-gradient(135deg, #FF4400, #D32F2F);
          box-shadow: 0 4px 24px rgba(255,68,0,0.35);
          position: relative;
          transition: all 0.3s ease;
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
          transform: translateY(-2px) scale(1.02);
        }
        .hw-btn-outline {
          transition: all 0.3s ease;
        }
        .hw-btn-outline:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 20px rgba(255,68,0,0.2);
        }
      `}</style>

      <section className="relative overflow-hidden flex flex-col hw-bold">
        <EnergyRings />
        <GlowingOrbs />
        <SparkLines />
        <FloatingEmbers />

        {/* ── Top marquee ── */}
        <div className="relative shrink-0 z-20">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: "linear-gradient(90deg, #FF4400, transparent 40%, transparent 60%, #FFD600)", filter: "blur(30px)" }} />
          <div className="relative overflow-hidden whitespace-nowrap py-2.5">
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #080100, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #080100, transparent)" }} />
            <div className="flex gap-6" style={{ width: "max-content", animation: "marqueeScroll 28s linear infinite" }}>
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0 mb-1"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-8 pointer-events-none"
              >
                <div className="w-full h-full rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #FF4400 20%, transparent 40%, #FFD600 60%, transparent 80%, #FF4400 100%)",
                    filter: "blur(20px)", opacity: 0.3,
                  }} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ animation: "burnPulse 2.5s ease-in-out infinite" }}
              >
                <Image src="/hw_logo.png" alt="HotWheels" width={320} height={320}
                  className="object-contain w-52 h-52 sm:w-60 sm:h-60" priority={false} />
              </motion.div>
            </motion.div>

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 justify-center"
            >
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Flame size={12} className="text-[#FF4400]" />
              </motion.span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Die-Cast Collection</span>
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>
                <Flame size={12} className="text-[#FF4400]" />
              </motion.span>
            </motion.div>

            {/* Headline */}
            <h2 className="text-[1.75rem] sm:text-3xl font-black leading-[1.05]"
              style={{ fontFamily: "Impact, sans-serif" }}>
              {headlineWords.map((word, i) => (
                <motion.span key={word}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                <motion.div key={l} className="flex items-center gap-1.5"
                  whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Icon size={11} style={{ color: "#FF6600" }} />
                  <div>
                    <p className="text-[11px] font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                    <p className="text-[8px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                  </div>
                </motion.div>
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
                className="hw-btn-fire group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-white overflow-hidden">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                <span className="relative z-10">Enter HotWheels</span>
                <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/hotwheels/products"
                className="hw-btn-outline group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold overflow-hidden"
                style={{ color: "#FF6600", border: "1.5px solid rgba(255,68,0,0.25)" }}>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(255,68,0,0.08)" }} />
                <span className="relative z-10">Browse All Cars</span>
              </Link>
            </motion.div>
          </div>

          {/* ═══════════ DESKTOP ═══════════ */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-12 xl:px-20 gap-12 xl:gap-20">

            {/* Left: text */}
            <div className="flex-1 flex flex-col justify-center max-w-xl">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #FF4400, transparent)" }} />
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Flame size={14} className="text-[#FF4400]" />
                </motion.span>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Die-Cast Collection</span>
              </motion.div>

              <h2 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-5"
                style={{ fontFamily: "Impact, sans-serif" }}>
                {headlineWords.map((word, i) => (
                  <motion.span key={word}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
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

              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.55, duration: 0.4 }}
                className="flex gap-8 mb-5"
              >
                {[
                  { icon: Trophy, v: "500+", l: "Rare Finds" },
                  { icon: Star, v: "2K+", l: "Collectors" },
                  { icon: Zap, v: "Weekly", l: "New Drops" },
                ].map(({ icon: Icon, v, l }) => (
                  <motion.div key={l} className="flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Icon size={14} style={{ color: "#FF6600" }} />
                    <div>
                      <p className="text-sm font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.4 }}
                className="text-sm leading-relaxed mb-6 max-w-md"
                style={{ color: "rgba(204,153,128,0.7)" }}
              >
                Treasure hunts, super treasure hunts, rare customs, and premium die-cast.
                <span className="text-[#FF6600] font-bold"> Explore the full collection.</span>
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.65, duration: 0.4 }}
                className="flex gap-4"
              >
                <Link href="/hotwheels"
                  className="hw-btn-fire group relative inline-flex items-center gap-2.5 px-9 py-4 rounded-xl text-sm font-black text-white overflow-hidden">
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
                  <span className="relative z-10">Enter HotWheels</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/hotwheels/products"
                  className="hw-btn-outline group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold overflow-hidden"
                  style={{ color: "#FF6600", border: "1.5px solid rgba(255,68,0,0.25)" }}>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(255,68,0,0.08)" }} />
                  <span className="relative z-10">Browse All Cars</span>
                </Link>
              </motion.div>
            </div>

            {/* Right: logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, x: 60, rotate: 10 }}
              whileInView={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-10 pointer-events-none"
              >
                <div className="w-full h-full rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, #FF4400 15%, transparent 30%, #FFD600 50%, transparent 65%, #FF4400 85%, transparent 100%)",
                    filter: "blur(25px)", opacity: 0.3,
                  }} />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-14 pointer-events-none"
              >
                <div className="w-full h-full rounded-full"
                  style={{ border: "1px dashed rgba(255,68,0,0.08)" }} />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ animation: "burnPulse 2.5s ease-in-out infinite" }}
              >
                <Image src="/hw_logo.png" alt="HotWheels" width={500} height={500}
                  className="object-contain w-[20rem] h-[20rem] xl:w-[24rem] xl:h-[24rem]" priority={false} />
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
              style={{ background: "linear-gradient(to right, #080100, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #080100, transparent)" }} />
            <div className="flex gap-6" style={{ width: "max-content", animation: "marqueeScroll 32s linear infinite reverse" }}>
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

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-30"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg-dark))" }} />
      </section>
    </>
  );
}
