"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Eye, EyeOff } from "lucide-react";
import { register } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);
    const result = await register(formData);

    if (result.success) {
      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
      router.push("/");
    } else {
      toast.error(result.error ?? "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-brand-soft flex items-center justify-center px-4 py-12 font-hind">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 gradient-organic rounded-2xl flex items-center justify-center shadow-premium">
              <span className="text-white font-bold text-2xl font-noto">S</span>
            </div>
            <span className="text-brand-black font-bold text-2xl font-noto">SAFEED FOODS</span>
          </Link>
          <h2 className="text-3xl font-bold text-brand-black font-noto">নতুন অ্যাকাউন্ট খুলুন</h2>
          <p className="mt-2 text-brand-black/50">আমাদের প্রিমিয়াম সার্ভিসের জন্য রেজিস্ট্রেশন করুন</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-premium border border-brand-black/5"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-black/70 ml-1">আপনার নাম</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="যেমন: মমিনুল ইসলাম"
                    className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-black/70 ml-1">ফোন নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="যেমন: ০১৭XXXXXXXX"
                    className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-black/70 ml-1">ইমেইল (ঐচ্ছিক)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-black/70 ml-1">পাসওয়ার্ড</label>
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-black/70 ml-1">ঠিকানা</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-brand-black/20" size={18} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="আপনার পূর্ণ ঠিকানা লিখুন..."
                  className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none resize-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 gradient-organic text-white rounded-2xl font-bold text-lg shadow-premium hover:opacity-90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isSubmitting ? "রেজিস্ট্রেশন হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              {!isSubmitting && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="text-center text-brand-black/50">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="text-brand-primary font-bold hover:underline">লগইন করুন</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
