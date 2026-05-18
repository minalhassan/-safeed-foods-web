"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);
    const result = await login(formData);

    if (result.success) {
      toast.success("লগইন সফল হয়েছে!");
      if (result.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      toast.error(result.error ?? "লগইন করতে সমস্যা হয়েছে।");
    }
    setIsSubmitting(false);
  };
  
  return (
    <main className="min-h-screen bg-brand-soft flex items-center justify-center px-4 py-12 font-hind">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 gradient-organic rounded-2xl flex items-center justify-center shadow-premium">
              <span className="text-white font-bold text-2xl font-noto">S</span>
            </div>
            <span className="text-brand-black font-bold text-2xl font-noto">SAFEED FOODS</span>
          </Link>
          <h2 className="text-3xl font-bold text-brand-black font-noto">স্বাগতম!</h2>
          <p className="mt-2 text-brand-black/50">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-premium border border-brand-black/5"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-black/70 ml-1">ইমেইল অথবা ফোন</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  placeholder="যেমন: ০১৭XXXXXXXX"
                  className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-brand-black/70">পাসওয়ার্ড</label>
                <Link href="/forgot" className="text-xs text-brand-primary font-bold hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/30 hover:text-brand-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 gradient-organic text-white rounded-2xl font-bold text-lg shadow-premium hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSubmitting ? "লগইন হচ্ছে..." : "লগইন করুন"}
              {!isSubmitting && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-black/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-brand-black/30 font-medium tracking-widest">অথবা</span>
              </div>
            </div>

            <p className="text-center text-brand-black/50">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="text-brand-primary font-bold hover:underline">রেজিস্ট্রেশন করুন</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
