"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "আরিফুর রহমান",
    role: "নিমিত্ত গ্রাহক",
    content: "সেফীড ফুডস এর আম খেয়ে মনে হয়েছে যেন নিজের বাগানের আম খাচ্ছি। একদম ফ্রেশ এবং কেমিক্যালমুক্ত। আমি গত ৩ বছর ধরে তাদের থেকেই অর্ডার করি।",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "নাসরিন আক্তার",
    role: "গৃহিণী",
    content: "বাচ্চাদের জন্য নিরাপদ খাবার খুঁজে পাওয়া এখন অনেক কঠিন। কিন্তু সেফীড ফুডস এর মধু এবং ঘি একদম খাঁটি। ধন্যবাদ তাদের এই চেষ্টার জন্য।",
    rating: 5,
    avatar: "NA"
  },
  {
    name: "জাহিদুল হক",
    role: "ব্যবসায়ী",
    content: "খুবই দ্রুত ডেলিভারি এবং প্যাকেজিং অসাধারণ। অর্গানিক পণ্যের এমন সার্ভিস বাংলাদেশে সত্যিই প্রশংসনীয়। শুভকামনা আপনাদের জন্য।",
    rating: 5,
    avatar: "JH"
  }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="reviews" className="py-24 px-4 md:px-8 bg-brand-soft/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-sm font-hind">
            Happy Customers
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-black font-noto">
            আমাদের গ্রাহকদের মন্তব্য
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-12 -left-4 md:-left-12 text-brand-primary/10">
            <Quote size={120} fill="currentColor" />
          </div>

          <div className="relative z-10 glass p-8 md:p-16 rounded-[2.5rem] shadow-premium">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex gap-1 justify-center md:justify-start">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#f9a825" color="#f9a825" />
                  ))}
                </div>

                <p className="text-xl md:text-2xl text-brand-black/80 font-hind leading-relaxed text-center md:text-left italic">
                  "{testimonials[current].content}"
                </p>

                <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                  <div className="w-16 h-16 rounded-full gradient-organic flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {testimonials[current].avatar}
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-lg font-bold text-brand-black font-noto">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-brand-black/50 text-sm font-hind">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center md:justify-end gap-4 mt-12 md:-mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-brand-black/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-brand-black/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
