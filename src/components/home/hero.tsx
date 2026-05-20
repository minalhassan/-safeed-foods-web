"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHeroSlides } from "@/lib/actions/hero";

const defaultSlides = [
  {
    id: "slide-1",
    image: "/hero-1.png",
    title: "খাঁটি আম সরাসরি বাগান থেকে",
    subtitle: "কেমিক্যালমুক্ত, নিরাপদ ও প্রিমিয়াম মানের আম এখন আপনার ঘরে",
    cta: "এখনই অর্ডার করুন",
    order: 1
  },
  {
    id: "slide-2",
    image: "/hero-2.png",
    title: "প্রাকৃতিক মধু ও অর্গানিক পণ্য",
    subtitle: "প্রকৃতির সেরা নির্যাস থেকে সংগৃহীত ১০০% বিশুদ্ধ ও নিরাপদ খাদ্য",
    cta: "পণ্যসমূহ দেখুন",
    order: 2
  },
  {
    id: "slide-3",
    image: "/hero-3.png",
    title: "পরিবারের সুস্বাস্থ্যের নিশ্চয়তা",
    subtitle: "প্রিমিয়াম কোয়ালিটি পণ্য যা আপনার পরিবারের প্রতিটি সদস্যের জন্য নিরাপদ",
    cta: "আমাদের সম্পর্কে জানুন",
    order: 3
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<any[]>(defaultSlides);

  useEffect(() => {
    async function loadSlides() {
      try {
        const dbSlides = await getHeroSlides();
        if (dbSlides && dbSlides.length > 0) {
          setSlides(dbSlides);
        }
      } catch (error) {
        console.error("Failed to load storefront hero slides:", error);
      }
    }
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative h-screen min-h-[600px] md:min-h-[800px] w-full overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current]?.image || "/hero-1.png"}
            alt={slides[current]?.title || "Safeed Foods"}
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay - Uniform black at 60% on mobile, right-fading gradient on desktop */}
          <div className="absolute inset-0 bg-brand-black/60 md:bg-gradient-to-r md:from-brand-black/80 md:via-brand-black/40 md:to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center items-start pt-28 md:pt-20">
        <div className="max-w-2xl space-y-6 md:space-y-10">
          <motion.div
            key={`title-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-brand-primary/20 text-brand-primary-light border border-brand-primary/30 text-xs font-bold tracking-widest uppercase font-hind">
              Premium Organic Foods
            </span>
            <h1 
              className="text-4xl md:text-7xl font-bold text-white font-noto leading-[1.1] tracking-tight"
              style={{ textShadow: "0 4px 16px rgba(0, 0, 0, 0.4)" }}
            >
              {slides[current]?.title}
            </h1>
          </motion.div>

          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-white/90 font-hind font-medium leading-relaxed max-w-xl"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)" }}
          >
            {slides[current]?.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5 pt-6"
          >
            <button className="w-full sm:w-auto px-10 py-5 gradient-organic text-white rounded-2xl font-bold text-lg shadow-premium hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 font-hind group">
              {slides[current]?.cta}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://wa.me/8801570262860"
              className="w-full sm:w-auto px-10 py-5 bg-white text-brand-black rounded-2xl font-bold text-lg hover:bg-brand-soft shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 font-hind"
            >
              <Phone className="text-brand-primary" size={22} />
              WhatsApp অর্ডার
            </a>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges - Now in flow at the bottom */}
      <div className="relative z-20 hidden lg:block pb-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white/90 backdrop-blur-2xl px-10 py-10 rounded-[2.5rem] shadow-premium grid grid-cols-4 gap-8 border border-white/20">
            {[
              { label: "কেমিক্যালমুক্ত", sub: "১০০% নিরাপদ খাদ্য" },
              { label: "বাগান থেকে সরাসরি", sub: "সর্বোচ্চ সতেজতা" },
              { label: "প্রিমিয়াম কোয়ালিটি", sub: "বাছাইকৃত সেরা পণ্য" },
              { label: "দ্রুত ডেলিভারি", sub: "সারা বাংলাদেশে" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center border-r last:border-0 border-brand-black/10 px-4 group/item">
                <span className="text-brand-primary font-bold text-xl font-noto mb-1 group-hover/item:scale-110 transition-transform">{item.label}</span>
                <span className="text-brand-black/60 text-sm font-hind font-medium">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators - Vertical on right */}
      <div className="absolute bottom-1/2 right-8 translate-y-1/2 hidden md:flex flex-col gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              "w-1.5 rounded-full transition-all duration-500",
              current === idx ? "h-12 bg-brand-primary" : "h-4 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
