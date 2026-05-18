"use client";

import React, { useState } from "react";
import { Image, Heading, Type, Link, Sparkles, Check, Save, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { updateHeroSlide } from "@/lib/actions/hero";

export default function HeroSlidesForm({ initialSlides }: { initialSlides: any[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const activeSlide = slides[activeSlideIndex];

  const handleFieldChange = (field: string, value: string) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === activeSlideIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      // Update slide background image URL with the uploaded path
      handleFieldChange("image", data.url);
      toast.success("ইমেজ সফলভাবে আপলোড করা হয়েছে!");
    } catch (err) {
      console.error("Slider upload error:", err);
      toast.error("ডিভাইস থেকে ইমেজ আপলোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateHeroSlide(activeSlide);
    setIsSaving(false);

    if (result.success) {
      toast.success(`স্লাইড ${activeSlideIndex + 1} সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      toast.error(result.error || "স্লাইড সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Selector & Edit Form panel */}
      <div className="lg:col-span-7 space-y-6">
        {/* Selector Tabs */}
        <div className="bg-white p-4 rounded-3xl border border-brand-black/5 shadow-premium flex gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(index)}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeSlideIndex === index
                  ? "bg-brand-primary text-white shadow-premium"
                  : "text-brand-black/40 hover:bg-brand-soft hover:text-brand-primary"
              }`}
            >
              <Sparkles size={16} />
              Slide {index + 1}
            </button>
          ))}
        </div>

        {/* Input Fields Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-brand-black/5 shadow-premium space-y-6">
          <div className="flex items-center gap-2 border-b border-brand-black/5 pb-4 mb-2">
            <span className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              {activeSlideIndex + 1}
            </span>
            <h3 className="font-bold text-lg text-brand-black font-noto">Slide {activeSlideIndex + 1} Content Settings</h3>
          </div>

          {/* Background Image Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-black/60 ml-1 flex items-center gap-1.5">
              <Image size={14} className="text-brand-black/35" />
              Background Image Path / URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={activeSlide.image}
                onChange={(e) => handleFieldChange("image", e.target.value)}
                placeholder="e.g. /hero-1.png or any direct image link..."
                className="flex-1 px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black"
              />
              
              {/* Styled File Upload Trigger Button */}
              <label className="px-5 py-3.5 bg-brand-soft text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl font-bold text-sm cursor-pointer transition-all border border-brand-primary/10 flex items-center justify-center gap-2 shrink-0">
                <Upload size={16} />
                {isUploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-[10px] text-brand-black/35 font-medium ml-1">
              Tip: You can upload your own image file from your device, or paste a public web image URL.
            </p>
          </div>

          {/* Headline Title Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-black/60 ml-1 flex items-center gap-1.5">
              <Heading size={14} className="text-brand-black/35" />
              Headline Title (Bengali/English)
            </label>
            <input
              type="text"
              value={activeSlide.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Headline text..."
              className="w-full px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black font-noto"
            />
          </div>

          {/* Subtitle Description Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-black/60 ml-1 flex items-center gap-1.5">
              <Type size={14} className="text-brand-black/35" />
              Subtitle Slogan
            </label>
            <textarea
              rows={3}
              value={activeSlide.subtitle}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="Slogan details..."
              className="w-full px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black resize-none font-hind leading-relaxed"
            />
          </div>

          {/* Button CTA Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-black/60 ml-1 flex items-center gap-1.5">
              <Link size={14} className="text-brand-black/35" />
              Call-To-Action Button Text
            </label>
            <input
              type="text"
              value={activeSlide.cta}
              onChange={(e) => handleFieldChange("cta", e.target.value)}
              placeholder="Button text..."
              className="w-full px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black font-hind"
            />
          </div>

          {/* Bottom Save Action */}
          <div className="pt-6 border-t border-brand-black/5 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="w-full md:w-auto px-8 py-4 gradient-organic text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 font-hind text-[15px]"
            >
              <Save size={18} />
              {isSaving ? "Saving Slide..." : "Save Slide Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Screen panel */}
      <div className="lg:col-span-5 space-y-4">
        <p className="text-xs font-bold text-brand-black/50 ml-1 uppercase tracking-wider">Live Mockup Preview</p>
        
        <div className="bg-brand-black rounded-[2.5rem] border border-brand-black/10 overflow-hidden shadow-2xl relative min-h-[460px] flex flex-col justify-end p-8">
          {/* Simulated Slide background */}
          <div className="absolute inset-0 z-0">
            {activeSlide.image ? (
              <img
                src={activeSlide.image}
                alt="Background slide preview"
                className="w-full h-full object-cover opacity-90 transition-all duration-300 scale-100"
                onError={(e) => {
                  // Fallback if URL is invalid
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1553046490-a7e0e4b816f1?auto=format&fit=crop&w=800&q=80";
                }}
              />
            ) : (
              <div className="w-full h-full bg-brand-black/90 flex items-center justify-center text-white/20 italic text-sm">
                No Background Image
              </div>
            )}
            {/* Organic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent z-10" />
          </div>

          {/* Simulated Content markup */}
          <div className="relative z-20 space-y-4 text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-[10px] font-bold tracking-wider uppercase font-hind">
              Premium Organic Foods
            </span>
            
            <h2 className="text-xl md:text-3xl font-bold text-white font-noto leading-tight drop-shadow-md">
              {activeSlide.title || "স্লাইড টাইটেল যুক্ত করুন"}
            </h2>
            
            <p className="text-xs text-white/80 font-hind leading-relaxed font-medium line-clamp-2">
              {activeSlide.subtitle || "স্লাইডের বিস্তারিত স্লোগান এখানে প্রদর্শিত হবে।"}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button className="px-5 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 font-hind">
                {activeSlide.cta || "Button Label"}
                <Check size={12} />
              </button>
              <div className="px-5 py-2.5 bg-white/20 text-white rounded-xl font-bold text-xs backdrop-blur-md">
                WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
