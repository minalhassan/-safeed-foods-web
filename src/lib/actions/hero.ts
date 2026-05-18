"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getHeroSlides() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("HeroSlide")
      .select("*")
      .order("order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        {
          id: "slide-1",
          image: "/hero-1.png",
          title: "খাঁটি আম সরাসরি বাগান থেকে",
          subtitle: "কেমিক্যালমুক্ত, নিরাপদ ও প্রিমিয়াম মানের আম এখন আপনার ঘরে",
          cta: "এখনই অর্ডার করুন",
          order: 1
        },
        {
          id: "slide-2",
          image: "/hero-2.png",
          title: "প্রাকৃতিক মধু ও অর্গানিক পণ্য",
          subtitle: "প্রকৃতির সেরা নির্যাস থেকে সংগৃহীত ১০০% বিশুদ্ধ ও নিরাপদ খাদ্য",
          cta: "পণ্যসমূহ দেখুন",
          order: 2
        },
        {
          id: "slide-3",
          image: "/hero-3.png",
          title: "পরিবারের সুস্বাস্থ্যের নিশ্চয়তা",
          subtitle: "প্রিমিয়াম কোয়ালিটি পণ্য যা আপনার পরিবারের প্রতিটি সদস্যের জন্য নিরাপদ",
          cta: "আমাদের সম্পর্কে জানুন",
          order: 3
        }
      ];
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return [
      {
        id: "slide-1",
        image: "/hero-1.png",
        title: "খাঁটি আম সরাসরি বাগান থেকে",
        subtitle: "কেমিক্যালমুক্ত, নিরাপদ ও প্রিমিয়াম মানের আম এখন আপনার ঘরে",
        cta: "এখনই অর্ডার করুন",
        order: 1
      },
      {
        id: "slide-2",
        image: "/hero-2.png",
        title: "প্রাকৃতিক মধু ও অর্গানিক পণ্য",
        subtitle: "প্রকৃতির সেরা নির্যাস থেকে সংগৃহীত ১০০% বিশুদ্ধ ও নিরাপদ খাদ্য",
        cta: "পণ্যসমূহ দেখুন",
        order: 2
      },
      {
        id: "slide-3",
        image: "/hero-3.png",
        title: "পরিবারের সুস্বাস্থ্যের নিশ্চয়তা",
        subtitle: "প্রিমিয়াম কোয়ালিটি পণ্য যা আপনার পরিবারের প্রতিটি সদস্যের জন্য নিরাপদ",
        cta: "আমাদের সম্পর্কে জানুন",
        order: 3
      }
    ];
  }
}

export async function updateHeroSlide(slide: {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  order: number;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("HeroSlide")
      .upsert({
        ...slide,
        updatedAt: new Date().toISOString()
      });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update hero slide:", error);
    return { success: false, error: error.message || "স্লাইড সংরক্ষণ করতে ব্যর্থ হয়েছে।" };
  }
}
