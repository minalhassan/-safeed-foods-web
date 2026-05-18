"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAnnouncement() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Announcement")
      .select("*")
      .eq("id", "announcement-default")
      .maybeSingle();

    if (error || !data) {
      console.log("Announcement table empty or missing. Using default fallback.");
      return {
        id: "announcement-default",
        text: "🚀 ঢাকা সিটিতে ৪৮ ঘন্টার মধ্যে ডেলিভারি! | ✨ ১০০% রিফান্ড গ্যারান্টি। | 🌿 সরাসরি বাগান থেকে বাছাইকৃত প্রিমিয়াম কোয়ালিটি পণ্য। | 🎁 আপনার প্রথম অর্ডারে ১০% ছাড়! প্রোমো কোড: FIRST10",
        isActive: true
      };
    }
    return data;
  } catch (error) {
    console.error("Failed to get announcement:", error);
    return {
      id: "announcement-default",
      text: "🚀 ঢাকা সিটিতে ৪৮ ঘন্টার মধ্যে ডেলিভারি! | ✨ ১০০% রিফান্ড গ্যারান্টি। | 🌿 সরাসরি বাগান থেকে বাছাইকৃত প্রিমিয়াম কোয়ালিটি পণ্য। | 🎁 আপনার প্রথম অর্ডারে ১০% ছাড়! প্রোমো কোড: FIRST10",
      isActive: true
    };
  }
}

export async function updateAnnouncement(text: string, isActive: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("Announcement")
      .upsert({
        id: "announcement-default",
        text,
        isActive,
        updatedAt: new Date().toISOString()
      });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update announcement:", error);
    return { success: false, error: error.message || "ঘোষণা আপডেট করতে ব্যর্থ হয়েছে।" };
  }
}
