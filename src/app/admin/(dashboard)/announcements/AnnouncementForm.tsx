"use client";

import React, { useState } from "react";
import { updateAnnouncement } from "@/lib/actions/announcement";
import { toast } from "react-hot-toast";
import { Volume2, Save, Eye } from "lucide-react";

export default function AnnouncementForm({ initialData }: { initialData: any }) {
  const [text, setText] = useState<string>(initialData.text);
  const [isActive, setIsActive] = useState<boolean>(initialData.isActive);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Announcement text cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    const result = await updateAnnouncement(text, isActive);

    if (result.success) {
      toast.success("Announcement updated successfully!");
    } else {
      toast.error(result.error || "Failed to update announcement.");
    }
    setIsSubmitting(false);
  };

  // Preview slides
  const slides = text.split("|").map((t: string) => t.trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-brand-black/5 shadow-premium overflow-hidden p-6 md:p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toggle bar state */}
        <div className="flex items-center justify-between p-4 bg-brand-soft rounded-2xl border border-brand-primary/5">
          <div className="flex items-center gap-3">
            <Volume2 className="text-brand-primary" size={24} />
            <div>
              <p className="font-bold text-brand-black text-[15px]">Announcement Bar Status</p>
              <p className="text-xs text-brand-black/40">Enable or disable the top header banner.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isActive ? 'bg-brand-primary' : 'bg-brand-black/20'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Edit Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-black/70 ml-1">Announcement Messages</label>
          <p className="text-xs text-brand-black/40 ml-1">
            Separate multiple sliding announcements using a pipe character ( <span className="font-bold text-brand-primary">|</span> ).
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="e.g. 🚀 ঢাকা সিটিতে ৪৮ ঘন্টার মধ্যে ডেলিভারি! | ✨ ১০০% রিফান্ড গ্যারান্টি।"
            className="w-full p-5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none text-brand-black resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="gradient-organic text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium hover:opacity-95 transition-all w-full md:w-auto disabled:opacity-50"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Announcement"}
        </button>
      </form>

      {/* Preview Section */}
      <div className="border-t border-brand-black/5 pt-6 space-y-4">
        <div className="flex items-center gap-2 text-brand-black/60 font-bold text-sm ml-1">
          <Eye size={18} className="text-brand-primary" />
          Live Preview
        </div>

        <div className="bg-brand-soft rounded-2xl p-4 space-y-3 border border-brand-black/5">
          <p className="text-[11px] font-bold text-brand-black/40 uppercase tracking-widest">Active Banner Slides</p>
          {slides.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {slides.map((slide: string, idx: number) => (
                <div key={idx} className="bg-white border border-brand-black/5 px-4 py-2.5 rounded-xl text-xs font-medium text-brand-black flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {slide}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-brand-black/30 italic">No messages written yet.</p>
          )}

          {isActive && slides.length > 0 && (
            <div className="mt-4 border-t border-brand-black/5 pt-4">
              <p className="text-[11px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">Simulated Banner Animation</p>
              <div className="bg-brand-primary text-white py-2 px-4 rounded-xl overflow-hidden relative">
                <div className="flex items-center gap-8 text-xs font-medium animate-pulse">
                  {slides.map((slide: string, idx: number) => (
                    <span key={idx} className="whitespace-nowrap">{slide}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
