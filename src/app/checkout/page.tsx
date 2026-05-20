"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, User, CreditCard, ShoppingBag, ShieldCheck, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { createOrder } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/lib/actions/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [bkashTrxId, setBkashTrxId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setFormData({
            name: currentUser.name || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
          });
        }
      } catch (error) {
        console.error("Failed to load user data on checkout:", error);
      }
    }
    loadUserData();
  }, []);

  const deliveryCharge = items.length > 0 ? 60 : 0;
  const finalTotal = totalPrice + deliveryCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("অনুগ্রহ করে সব তথ্য পূরণ করুন।");
      return;
    }
    if (paymentMethod === "bkash" && !bkashTrxId.trim()) {
      toast.error("অনুগ্রহ করে বিকাশ ট্রানজেকশন আইডি দিন।");
      return;
    }

    setIsSubmitting(true);
    const result = await createOrder(
      { ...formData, paymentMethod, bkashTrxId: paymentMethod === "bkash" ? bkashTrxId : undefined },
      items,
      finalTotal
    );

    if (result.success) {
      toast.success("অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
      clearCart();
      router.push(`/order-success/${result.orderId}`);
    } else {
      toast.error(result.error || "অর্ডার করতে সমস্যা হয়েছে।");
    }
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-brand-soft/30 flex items-center justify-center pt-20">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 bg-brand-soft rounded-full flex items-center justify-center mx-auto text-brand-black/20">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-2xl font-bold font-noto">আপনার কার্ট খালি!</h1>
          <Link href="/products" className="inline-block px-8 py-4 gradient-organic text-white rounded-2xl font-bold">
            পণ্য কিনুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-soft/30">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto font-hind">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-brand-black font-noto">চেকআউট</h1>
              <p className="text-brand-black/50">অনুগ্রহ করে আপনার ডেলিভারি তথ্য প্রদান করুন।</p>
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-brand-black/5 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-brand-black font-noto">শিপিং অ্যাড্রেস</h2>
              </div>
              
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
                <label className="text-sm font-bold text-brand-black/70 ml-1">পূর্ণ ঠিকানা</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="আপনার পূর্ণ ঠিকানা লিখুন..."
                  rows={4}
                  className="w-full px-6 py-4 bg-brand-soft border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-brand-black/5 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-brand-black font-noto">পেমেন্ট মেথড</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: "cod", name: "ক্যাশ অন ডেলিভারি", desc: "পণ্য বুঝে নিয়ে মূল্য পরিশোধ করুন" },
                  { id: "bkash", name: "বিকাশ / নগদ পেমেন্ট", desc: "অনলাইনে পেমেন্ট করে দ্রুত ডেলিভারি নিন" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 text-left transition-all",
                      paymentMethod === method.id
                        ? "border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/5"
                        : "border-brand-black/5 hover:border-brand-primary/30"
                    )}
                  >
                    <p className="font-bold text-brand-black font-noto mb-1">{method.name}</p>
                    <p className="text-xs text-brand-black/40 leading-relaxed">{method.desc}</p>
                  </button>
                ))}
              </div>

              {/* bKash Payment Instructions */}
              {paymentMethod === "bkash" && (
                <div className="mt-6 p-6 bg-[#E2136E]/5 border-2 border-[#E2136E]/20 rounded-3xl space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E2136E] flex items-center justify-center text-white font-bold text-sm">b</div>
                    <h3 className="font-bold text-brand-black font-noto">বিকাশ পেমেন্ট নির্দেশনা</h3>
                  </div>

                  <div className="bg-white rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-black/50">মার্চেন্ট নম্বর</span>
                      <span className="font-black text-lg text-[#E2136E] font-noto tracking-wide">01800-000000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-black/50">পরিমাণ</span>
                      <span className="font-bold text-brand-black font-noto">৳{finalTotal}</span>
                    </div>
                  </div>

                  <ol className="space-y-2 text-sm text-brand-black/60 list-decimal list-inside">
                    <li>আপনার বিকাশ অ্যাপ খুলুন এবং <strong className="text-brand-black">"Send Money"</strong> সিলেক্ট করুন</li>
                    <li>উপরের মার্চেন্ট নম্বরে <strong className="text-brand-black">৳{finalTotal}</strong> টাকা পাঠান</li>
                    <li>পেমেন্টের পর আপনি যে <strong className="text-brand-black">Transaction ID (TrxID)</strong> পাবেন সেটি নিচে লিখুন</li>
                  </ol>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-black/70 ml-1">বিকাশ ট্রানজেকশন আইডি (TrxID) *</label>
                    <input
                      type="text"
                      value={bkashTrxId}
                      onChange={(e) => setBkashTrxId(e.target.value)}
                      placeholder="যেমন: TRX2A5B8C9D1E"
                      className="w-full px-6 py-4 bg-white border-2 border-[#E2136E]/20 focus:border-[#E2136E] rounded-2xl transition-all outline-none font-medium text-brand-black"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5">
            <div className="bg-brand-black text-white p-8 md:p-10 rounded-[3rem] shadow-premium sticky top-32 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingBag className="text-brand-primary" size={24} />
                <h2 className="text-2xl font-bold font-noto">অর্ডার সামারি</h2>
              </div>

              <div className="space-y-6">
                {/* Product List */}
                <div className="max-h-60 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold font-noto line-clamp-1">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-white/40 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/40 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold">৳{item.price * item.quantity}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-white/10" />

                <div className="space-y-4">
                  <div className="flex justify-between text-white/60">
                    <span>সাবটোটাল</span>
                    <span>৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>ডেলিভারি চার্জ</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>ডিসকাউন্ট</span>
                    <span className="text-brand-accent">- ৳০</span>
                  </div>
                  <hr className="border-white/10 pt-4" />
                  <div className="flex justify-between text-2xl font-bold">
                    <span className="font-noto">সর্বমোট</span>
                    <span className="text-brand-primary">৳{totalPrice + deliveryCharge}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "w-full py-5 gradient-organic text-white rounded-2xl font-bold text-xl shadow-premium transition-all flex items-center justify-center gap-3 font-hind",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.5)]"
                )}
              >
                {isSubmitting ? "প্রসেসিং হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
              </button>

              <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
                <ShieldCheck size={14} />
                <span>আপনার সকল তথ্য আমাদের কাছে সুরক্ষিত।</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
