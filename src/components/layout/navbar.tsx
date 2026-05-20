"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeedLogo from "@/components/ui/safeed-logo";
import { ShoppingCart, Menu, X, Search, Phone, User, ChevronRight, LogOut, LayoutDashboard, MapPin, Edit3, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "./announcement-bar";
import { getCurrentUser, logout, updateUserProfile } from "@/lib/actions/auth";
import { getStoreSettings } from "@/lib/actions/settings";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const navLinks = [
  { name: "হোম", href: "/" },
  { name: "পণ্যসমূহ", href: "/products" },
  { name: "ক্যাটাগরি", href: "/#categories" },
  { name: "আমাদের সম্পর্কে", href: "/#about" },
  { name: "রিভিউ", href: "/#reviews" },
];

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState<string>("8801570262860");

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setEditName(currentUser.name);
        setEditAddress(currentUser.address || "");
      }
      
      try {
        const store = await getStoreSettings();
        if (store && store.whatsapp) {
          setWhatsapp(store.whatsapp);
        }
      } catch (error) {
        console.error("Failed to load navbar dynamic whatsapp:", error);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      setIsEditingMobile(false);
      toast.success("লগআউট সফল হয়েছে!");
      router.push("/login");
    } else {
      toast.error("লগআউট করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    setIsSaving(true);
    const result = await updateUserProfile(editName, editAddress);

    if (result.success) {
      setUser((prev: any) => ({ ...prev, name: editName, address: editAddress }));
      setIsEditing(false);
      setIsEditingMobile(false);
      toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
    } else {
      toast.error(result.error || "আপডেট করতে সমস্যা হয়েছে।");
    }
    setIsSaving(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-brand-primary/10 shadow-premium">
      <AnnouncementBar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between py-3 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <SafeedLogo 
            size={44}
            className="transition-all duration-300 hover:scale-105"
          />
          <span className="font-bold text-brand-black tracking-wide text-base sm:text-xl font-noto">
            SAFEED FOODS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative font-bold text-brand-black/80 hover:text-brand-primary transition-colors font-hind py-2 group text-[15px]"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 h-0.5 bg-brand-primary w-0 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Icons & Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-brand-black/70 hover:text-brand-primary hover:bg-brand-primary/5 transition-all hidden md:flex">
            <Search size={20} />
          </button>
          
          <Link href="/checkout" className="relative w-10 h-10 rounded-full flex items-center justify-center text-brand-black/70 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          <div className="relative hidden md:block">
            {user ? (
              <>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsEditing(false); // Reset edit mode on toggle
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white gradient-organic hover:opacity-90 hover:scale-105 transition-all font-bold font-noto border-2 border-white shadow-premium"
                >
                  {user.name.slice(0, 1).toUpperCase()}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-brand-primary/10 rounded-[2.5rem] shadow-2xl p-6 space-y-4 z-50"
                    >
                      {!isEditing ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 border-b border-brand-black/5 pb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white gradient-organic font-bold text-lg font-noto">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-brand-black text-[16px] font-noto leading-tight">{user.name}</p>
                              <span className="inline-block px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-bold rounded-md uppercase tracking-wider">
                                {user.role === "ADMIN" ? "অ্যাডমিন" : "গ্রাহক"}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3 bg-brand-soft/70 rounded-2xl p-3 border border-brand-black/5">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm flex-shrink-0">
                                <Phone size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-brand-black/35 uppercase tracking-wide">ফোন নাম্বার</p>
                                <p className="text-xs font-semibold text-brand-black font-mono">{user.phone}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 bg-brand-soft/70 rounded-2xl p-3 border border-brand-black/5">
                              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm flex-shrink-0 mt-0.5">
                                <MapPin size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-brand-black/35 uppercase tracking-wide">শিপিং ঠিকানা</p>
                                <p className="text-xs font-semibold text-brand-black/70 leading-relaxed break-words whitespace-pre-wrap">
                                  {user.address || "ঠিকানা যুক্ত করা হয়নি"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <button
                              onClick={() => {
                                setEditName(user.name);
                                setEditAddress(user.address || "");
                                setIsEditing(true);
                              }}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-black/70 hover:text-brand-primary hover:bg-brand-soft transition-all text-xs font-bold w-full text-left"
                            >
                              <Edit3 size={14} className="text-brand-primary" />
                              প্রোফাইল ও ঠিকানা পরিবর্তন
                            </button>

                            {user.role === "ADMIN" && (
                              <Link 
                                href="/admin"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-black/70 hover:text-brand-primary hover:bg-brand-soft transition-all text-xs font-bold"
                              >
                                <LayoutDashboard size={14} className="text-brand-primary" />
                                অ্যাডমিন ড্যাশবোর্ড
                              </Link>
                            )}
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-xs font-bold w-full text-left"
                            >
                              <LogOut size={14} className="text-red-500" />
                              লগআউট করুন
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                          <p className="font-bold text-brand-black text-[15px] border-b border-brand-black/5 pb-2 font-noto">প্রোফাইল আপডেট</p>
                          
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-black/50 ml-1">আপনার নাম</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-4 py-2.5 bg-brand-soft border border-brand-black/5 focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none text-xs font-semibold"
                              placeholder="আপনার নাম"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-brand-black/50 ml-1">পূর্ণ শিপিং ঠিকানা</label>
                            <textarea
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2.5 bg-brand-soft border border-brand-black/5 focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none text-xs font-semibold resize-none"
                              placeholder="ঠিকানা (যেমন: মিরপুর, ঢাকা)"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="flex-1 py-2.5 border border-brand-black/10 rounded-xl font-bold text-xs hover:bg-brand-soft transition-all"
                            >
                              বাতিল
                            </button>
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="flex-1 py-2.5 gradient-organic text-white rounded-xl font-bold text-xs shadow-premium flex items-center justify-center gap-1 hover:opacity-90 transition-all"
                            >
                              <Check size={14} />
                              {isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ"}
                            </button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link href="/login" className="w-10 h-10 rounded-full flex items-center justify-center text-brand-black/70 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                <User size={20} />
              </Link>
            )}
          </div>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 gradient-organic text-white px-5 py-2.5 rounded-2xl font-bold shadow-premium hover:shadow-[0_15px_30px_-5px_rgba(46,125,50,0.3)] hover:-translate-y-0.5 transition-all font-hind text-[14px]"
          >
            <Phone size={16} />
            অর্ডার করুন
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-brand-black bg-brand-soft hover:bg-brand-primary/10 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-brand-black/5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-6 font-hind">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-brand-soft text-lg text-brand-black/80 hover:text-brand-primary font-bold transition-all"
                  >
                    {link.name}
                    <ChevronRight size={18} className="opacity-30" />
                  </Link>
                </motion.div>
              ))}
              
              <div className="h-px bg-brand-black/5 my-4" />
              
              <div className="grid grid-cols-1 gap-4 pt-2">
                {user ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] p-5 space-y-4 shadow-sm">
                    {!isEditingMobile ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between border-b border-brand-primary/10 pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white gradient-organic font-bold text-sm font-noto">
                              {user.name.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-brand-black text-[15px] font-noto leading-tight">{user.name}</p>
                              <span className="inline-block px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-bold rounded-md uppercase tracking-wider">
                                {user.role === "ADMIN" ? "অ্যাডমিন" : "গ্রাহক"}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEditName(user.name);
                              setEditAddress(user.address || "");
                              setIsEditingMobile(true);
                            }}
                            className="p-2 rounded-xl bg-white text-brand-primary border border-brand-primary/15 shadow-sm hover:bg-brand-primary/5 transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-brand-black/60 bg-white/60 p-2.5 rounded-xl border border-brand-black/5">
                            <Phone size={12} className="text-brand-primary" />
                            <span className="font-mono">{user.phone}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs font-semibold text-brand-black/60 bg-white/60 p-2.5 rounded-xl border border-brand-black/5 leading-relaxed">
                            <MapPin size={12} className="text-brand-primary mt-0.5 flex-shrink-0" />
                            <span className="break-words max-w-[220px]">
                              {user.address || "ঠিকানা যুক্ত করা হয়নি"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-1 border-t border-brand-primary/5">
                          {user.role === "ADMIN" && (
                            <Link 
                              href="/admin"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-brand-black/5 text-brand-black text-xs font-bold shadow-sm"
                            >
                              <LayoutDashboard size={14} className="text-brand-primary" />
                              অ্যাডমিন ড্যাশবোর্ড
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold w-full transition-all"
                          >
                            <LogOut size={14} className="text-red-500" />
                            লগআউট করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <p className="font-bold text-brand-black text-sm border-b border-brand-black/5 pb-2 font-noto">প্রোফাইল আপডেট</p>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-black/50 ml-1">আপনার নাম</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-brand-black/5 focus:border-brand-primary rounded-xl transition-all outline-none text-xs font-semibold"
                            placeholder="আপনার নাম"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-black/50 ml-1">শিপিং ঠিকানা</label>
                          <textarea
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-white border border-brand-black/5 focus:border-brand-primary rounded-xl transition-all outline-none text-xs font-semibold resize-none"
                            placeholder="ঠিকানা (যেমন: মিরপুর, ঢাকা)"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingMobile(false)}
                            className="flex-1 py-2 border border-brand-black/10 rounded-xl font-bold text-xs bg-white hover:bg-brand-soft transition-all"
                          >
                            বাতিল
                          </button>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 py-2 gradient-organic text-white rounded-xl font-bold text-xs shadow-premium flex items-center justify-center gap-1 hover:opacity-90 transition-all"
                          >
                            <Check size={14} />
                            {isSaving ? "সেভ হচ্ছে..." : "সংরক্ষণ"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-[2rem] bg-brand-soft text-brand-black font-bold border border-brand-black/5 shadow-sm text-sm"
                  >
                    <User size={18} className="text-brand-primary" />
                    লগইন / রেজিস্ট্রেশন করুন
                  </Link>
                )}
                
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 gradient-organic text-white py-4 rounded-2xl font-bold shadow-premium"
                >
                  <Phone size={20} />
                  WhatsApp এ অর্ডার করুন
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
