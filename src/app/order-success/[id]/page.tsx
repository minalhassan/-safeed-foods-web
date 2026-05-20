"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { use } from "react";

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-brand-soft/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-[3rem] shadow-premium p-10 md:p-16 text-center space-y-8 border border-brand-black/5"
        >
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle size={64} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black font-noto">অভিনন্দন!</h1>
            <p className="text-brand-black/60 text-lg font-hind">
              আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
            </p>
          </div>

          <div className="bg-brand-soft p-6 rounded-2xl space-y-2">
            <p className="text-xs text-brand-black/40 uppercase tracking-widest font-bold">অর্ডার আইডি</p>
            <p className="text-xl font-bold text-brand-primary font-mono">#ORD-{id.slice(-8).toUpperCase()}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="px-8 py-4 glass text-brand-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-soft transition-all font-hind"
            >
              <Home size={20} />
              হোমে ফিরে যান
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 gradient-organic text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium hover:opacity-90 transition-all font-hind"
            >
              আরো শপিং করুন
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="pt-8 border-t border-brand-black/5">
            <div className="flex items-center justify-center gap-3 text-brand-black/40 text-sm">
              <Package size={18} />
              <span>৪৮ ঘন্টার মধ্যে ডেলিভারি নিশ্চিত করা হবে।</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
