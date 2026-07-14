"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Zap, Trophy, Star, Flag } from "lucide-react";

const TICKER_WORDS = ["TREASURE HUNT", "SUPER TH", "RARE", "1:64 SCALE", "PREMIUM", "CUSTOMS", "TH", "NEW ARRIVALS", "COLLECTOR", "DIE-CAST", "WILDCARD", "ULTRA HOT", "FORGOTTEN", "FLAME", "TRACK"];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative shrink-0 z-20">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
      <div className="overflow-hidden whitespace-nowrap py-2.5">
        <div className="flex gap-6" style={{
          width: "max-content",
          animation: `marqueeScroll ${reverse ? "32s" : "28s"} linear infinite${reverse ? " reverse" : ""}`,
        }}>
          {[...Array(3)].map((_, set) =>
            TICKER_WORDS.map((word, i) => (
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
  );
}

export function HotWheelsPromoSection() {
  const headlineWords = ["FUEL", "YOUR", "DIE-CAST", "OBSESSION"];

  return (
      <section className="hw-racing overflow-hidden flex flex-col" data-snap>

        {/* ── Background layers ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Checkered flag pattern — subtle, animated scroll */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%),
                linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)
              `,
              backgroundSize: "30px 30px",
              backgroundPosition: "0 0, 15px 15px",
              animation: "checkScroll 4s linear infinite",
            }} />

          {/* Racing stripes — vertical, animated scroll */}
          <div className="absolute top-0 bottom-0 left-[8%] w-[3px]"
            style={{
              background: "repeating-linear-gradient(to bottom, #FF4400 0px, #FF4400 20px, transparent 20px, transparent 40px)",
              opacity: 0.06,
              animation: "stripeScroll 3s linear infinite",
            }} />
          <div className="absolute top-0 bottom-0 left-[12%] w-[1px]"
            style={{
              background: "repeating-linear-gradient(to bottom, #FFD600 0px, #FFD600 15px, transparent 15px, transparent 35px)",
              opacity: 0.04,
              animation: "stripeScroll 4s linear infinite",
            }} />
          <div className="absolute top-0 bottom-0 right-[8%] w-[3px]"
            style={{
              background: "repeating-linear-gradient(to bottom, #FF4400 0px, #FF4400 20px, transparent 20px, transparent 40px)",
              opacity: 0.06,
              animation: "stripeScroll 3s linear infinite reverse",
            }} />
          <div className="absolute top-0 bottom-0 right-[12%] w-[1px]"
            style={{
              background: "repeating-linear-gradient(to bottom, #FFD600 0px, #FFD600 15px, transparent 15px, transparent 35px)",
              opacity: 0.04,
              animation: "stripeScroll 4s linear infinite reverse",
            }} />

          {/* Speed lines — horizontal streaks */}
          {[
            { top: "15%", dur: "2.5s", delay: "0s", color: "#FF4400", opacity: 0.08, h: 1 },
            { top: "25%", dur: "3s", delay: "0.8s", color: "#FFD600", opacity: 0.05, h: 1 },
            { top: "40%", dur: "2s", delay: "1.5s", color: "#FF4400", opacity: 0.06, h: 2 },
            { top: "55%", dur: "3.5s", delay: "0.3s", color: "#FF6600", opacity: 0.04, h: 1 },
            { top: "70%", dur: "2.8s", delay: "1.2s", color: "#FFD600", opacity: 0.06, h: 1 },
            { top: "85%", dur: "3.2s", delay: "0.6s", color: "#FF4400", opacity: 0.05, h: 2 },
          ].map((l, i) => (
            <div key={i} className="absolute left-0"
              style={{
                top: l.top,
                width: "80px",
                height: `${l.h}px`,
                background: `linear-gradient(90deg, transparent, ${l.color}, transparent)`,
                opacity: l.opacity,
                animation: `speedLine ${l.dur} ${l.delay} linear infinite`,
              }} />
          ))}

          {/* Diagonal slash accents */}
          <div className="absolute -right-[10%] top-0 bottom-0 w-[40%]"
            style={{
              background: "linear-gradient(135deg, transparent 40%, rgba(255,68,0,0.04) 50%, transparent 60%)",
              clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
            }} />
          <div className="absolute -left-[5%] top-0 bottom-0 w-[30%]"
            style={{
              background: "linear-gradient(-135deg, transparent 40%, rgba(255,214,0,0.03) 50%, transparent 60%)",
              clipPath: "polygon(0 0, 80% 0, 100% 100%, 20% 100%)",
            }} />

          {/* Ambient glow spots — no blur, just opacity */}
          <div className="absolute top-[20%] left-[15%] w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,68,0,0.06) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,214,0,0.04) 0%, transparent 70%)" }} />
        </div>

        <Marquee />

        {/* ── Main content ── */}
        <div className="relative z-20 flex-1 flex flex-col overflow-hidden">

          {/* ═══════════ MOBILE ═══════════ */}
          <div className="lg:hidden flex-1 flex flex-col items-center justify-center px-5 gap-4 text-center">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0 mb-1"
            >
              <Image src="/hw_logo.png" alt="HotWheels" width={320} height={320}
                sizes="(max-width: 640px) 208px, 240px"
                className="object-contain w-52 h-52 sm:w-60 sm:h-60" priority={false} />
            </motion.div>

            {/* Eyebrow */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center gap-2 justify-center"
            >
              <Flag size={12} className="text-[#FF4400]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Die-Cast Collection</span>
              <Flag size={12} className="text-[#FF4400]" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-[1.75rem] sm:text-3xl font-black leading-[1.05]"
              style={{ fontFamily: "Impact, sans-serif" }}>
              {headlineWords.map((word, i) => (
                <motion.span key={word}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
              viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.3 }}
              className="flex gap-5 justify-center"
            >
              {[
                { icon: Trophy, v: "500+", l: "Finds" },
                { icon: Star, v: "2K+", l: "Collectors" },
                { icon: Zap, v: "Weekly", l: "Drops" },
              ].map(({ icon: Icon, v, l }) => (
                <div key={l} className="flex items-center gap-1.5">
                  <Icon size={11} className="text-[#FF6600]" />
                  <div>
                    <p className="text-[11px] font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                    <p className="text-[8px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Subtext */}
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="text-xs max-w-xs leading-relaxed"
              style={{ color: "rgba(204,153,128,0.7)" }}
            >Treasure hunts · Super treasure hunts · Rare customs · Premium die-cast</motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.3 }}
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
                className="hw-btn-outline group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold"
                style={{ color: "#FF6600" }}>
                <span className="relative z-10">Browse All Cars</span>
              </Link>
            </motion.div>
          </div>

          {/* ═══════════ DESKTOP ═══════════ */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-12 xl:px-20 gap-12 xl:gap-20">

            {/* Left: text */}
            <div className="flex-1 flex flex-col justify-center max-w-xl">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.4 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-12 h-px" style={{ background: "linear-gradient(90deg, #FF4400, transparent)" }} />
                <Flag size={14} className="text-[#FF4400]" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#FF6600]">Die-Cast Collection</span>
              </motion.div>

              <h2 className="text-5xl xl:text-6xl font-black leading-[1.05] mb-5"
                style={{ fontFamily: "Impact, sans-serif" }}>
                {headlineWords.map((word, i) => (
                  <motion.span key={word}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.3 }}
                className="flex gap-8 mb-5"
              >
                {[
                  { icon: Trophy, v: "500+", l: "Rare Finds" },
                  { icon: Star, v: "2K+", l: "Collectors" },
                  { icon: Zap, v: "Weekly", l: "New Drops" },
                ].map(({ icon: Icon, v, l }) => (
                  <div key={l} className="flex items-center gap-2">
                    <Icon size={14} className="text-[#FF6600]" />
                    <div>
                      <p className="text-sm font-black" style={{ color: "#FFE0CC" }}>{v}</p>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: "#8a6650" }}>{l}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.3 }}
                className="text-sm leading-relaxed mb-6 max-w-md"
                style={{ color: "rgba(204,153,128,0.7)" }}
              >
                Treasure hunts, super treasure hunts, rare customs, and premium die-cast.
                <span className="text-[#FF6600] font-bold"> Explore the full collection.</span>
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.3 }}
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
                  className="hw-btn-outline group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold"
                  style={{ color: "#FF6600" }}>
                  <span className="relative z-10">Browse All Cars</span>
                </Link>
              </motion.div>
            </div>

            {/* Right: logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <Image src="/hw_logo.png" alt="HotWheels" width={500} height={500}
                sizes="(max-width: 1280px) 320px, 384px"
                className="object-contain w-[20rem] h-[20rem] xl:w-[24rem] xl:h-[24rem]" priority={false} />
            </motion.div>
          </div>
        </div>

        <Marquee reverse />

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-30"
          style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }} />
      </section>
  );
}
