"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Sprout, Heart } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "১০০% নিরাপদ",
    desc: "কোনো প্রকার কেমিক্যাল বা প্রিজারভেটিভ ব্যবহার করা হয় না।",
  },
  {
    icon: Leaf,
    title: "সরাসরি বাগান থেকে",
    desc: "মাঝারি কোনো পক্ষ নেই, বাগান থেকে সরাসরি আপনার ঘরে।",
  },
  {
    icon: Sprout,
    title: "প্রাকৃতিক চাষাবাদ",
    desc: "সম্পূর্ণ প্রাকৃতিকভাবে আমাদের নিজস্ব তত্ত্বাবধানে উৎপাদিত।",
  },
  {
    icon: Heart,
    title: "সেরা স্বাদ ও পুষ্টি",
    desc: "সঠিক সময়ে ফসল সংগ্রহ করে স্বাদ ও পুষ্টি নিশ্চিত করা হয়।",
  },
];

export default function FarmStory() {
  return (
    <section id="about" className="py-24 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl z-10"
            >
              <Image
                src="/hero-1.png"
                alt="Our Orchard"
                fill
                className="object-cover"
              />
            </motion.div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 gradient-organic rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
            


          </div>

          {/* Text Side */}
          <div className="space-y-10 font-hind">
            <div className="space-y-4">
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-brand-primary font-bold tracking-[0.2em] uppercase text-sm"
              >
                Our Legacy & Trust
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-brand-black font-noto leading-[1.3]"
              >
                বিশুদ্ধতার সাথে কোনো আপোষ নয়, <br className="hidden md:block" />
                <span className="text-brand-primary">প্রকৃতির সেরা স্বাদ</span> আপনার ঘরে
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-brand-black/60 text-lg leading-relaxed max-w-xl"
              >
                সেফীড ফুডস এর যাত্রা শুরু হয়েছে মানুষের কাছে খাঁটি ও কেমিক্যালমুক্ত খাবার পৌঁছে দেওয়ার অঙ্গীকার নিয়ে। আমরা বিশ্বাস করি, সুস্থ জীবনের জন্য বিশুদ্ধ খাদ্যের কোনো বিকল্প নেই।
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-brand-primary">
                    <feature.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-black font-noto mb-1">{feature.title}</h4>
                    <p className="text-sm text-brand-black/50 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="pt-6"
            >
              <button className="px-10 py-4 bg-brand-black text-white rounded-2xl font-bold hover:bg-brand-primary transition-all shadow-premium font-hind">
                আমাদের গল্প পড়ুন
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
