import React from "react";
import { getHeroSlides } from "@/lib/actions/hero";
import HeroSlidesForm from "./HeroSlidesForm";

export default async function AdminHeroPage() {
  const slides = await getHeroSlides();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-brand-black font-noto tracking-tight">Hero Background Slider</h1>
        <p className="text-brand-black/50 text-sm mt-1">
          Customize the sliding background images, headlines, subtitles, and call-to-actions running on the storefront homepage.
        </p>
      </div>

      <HeroSlidesForm initialSlides={slides} />
    </div>
  );
}
