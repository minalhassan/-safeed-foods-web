"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, Shield } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(formData);
    
    if (result.success) {
      if (result.user?.role === 'ADMIN') {
        toast.success("Dashboard access granted!");
        router.push("/admin");
      } else {
        toast.error("You are not authorized to access the admin panel.");
      }
    } else {
      toast.error(result.error ?? "লগইন করতে ব্যর্থ হয়েছে।");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-soft/30 flex items-center justify-center p-4 font-hind">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-premium border border-brand-black/5 p-8 md:p-12"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 gradient-organic rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brand-black font-noto">Admin Access</h1>
          <p className="text-brand-black/50 text-sm">Please enter your credentials to manage Safeed Foods.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-black/70 ml-1">Username / Identifier</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={20} />
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                placeholder="Enter your email or phone"
                className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-black/70 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={20} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 gradient-organic text-white rounded-2xl font-bold text-lg shadow-premium hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? "Authenticating..." : "Login to Dashboard"}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
