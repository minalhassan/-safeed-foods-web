"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      // Simulate API call
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <section className="py-24 px-4 md:px-8 relative overflow-hidden bg-brand-black">
      {/* Decorative organic patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-brand-primary-light font-bold tracking-[0.2em] uppercase text-sm font-hind">
            Stay Updated
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-noto">
            আমাদের অফার এবং নতুন আপডেট পান
          </h2>
          <p className="text-white/60 text-lg font-hind max-w-2xl mx-auto">
            আপনার ইমেইল দিয়ে সাবস্ক্রাইব করুন এবং প্রতি সপ্তাহের সেরা অফার ও নতুন পণ্যের আপডেট সরাসরি আপনার ইনবক্সে পান।
          </p>

          <div className="pt-8 max-w-md mx-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-primary/10 border border-brand-primary/20 p-6 rounded-2xl flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="text-brand-primary-light" size={24} />
                <span className="text-white font-medium font-hind">সাবস্ক্রাইব করার জন্য ধন্যবাদ!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল এড্রেস"
                  className="w-full bg-white/5 border border-white/10 text-white px-6 py-5 rounded-2xl outline-none focus:border-brand-primary/50 transition-all font-hind placeholder:text-white/30"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-brand-primary hover:bg-brand-primary-light text-white px-6 rounded-xl transition-all flex items-center justify-center gap-2 font-bold"
                >
                  <span className="hidden sm:inline">সাবস্ক্রাইব</span>
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
          
          <p className="text-white/30 text-xs font-hind">
            আমরা আপনার গোপনীয়তা রক্ষা করি। কোনো স্প্যাম পাঠানো হবে না।
          </p>
        </motion.div>
      </div>
    </section>
  );
}
