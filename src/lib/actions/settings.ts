"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("StoreSetting")
      .select("*")
      .eq("id", "store-default")
      .maybeSingle();

    if (error || !data) {
      console.log("StoreSetting table empty or missing. Using default fallback.");
      return {
        id: "store-default",
        storeName: "Safeed Foods",
        storeEmail: "hello@safeedfoods.com",
        phone: "+880 15702 62860",
        address: "Dhaka, Bangladesh",
        description: "Premium Organic Foods straight from our orchards to your doorstep.",
        whatsapp: "8801570262860"
      };
    }
    return {
      id: "store-default",
      storeName: data.storeName || "Safeed Foods",
      storeEmail: data.storeEmail || "hello@safeedfoods.com",
      phone: data.phone || "+880 15702 62860",
      address: data.address || "Dhaka, Bangladesh",
      description: data.description || "Premium Organic Foods straight from our orchards to your doorstep.",
      whatsapp: data.whatsapp || "8801570262860"
    };
  } catch (error) {
    console.error("Failed to get store settings:", error);
    return {
      id: "store-default",
      storeName: "Safeed Foods",
      storeEmail: "hello@safeedfoods.com",
      phone: "+880 15702 62860",
      address: "Dhaka, Bangladesh",
      description: "Premium Organic Foods straight from our orchards to your doorstep.",
      whatsapp: "8801570262860"
    };
  }
}

export async function updateStoreSettings(settings: {
  storeName: string;
  storeEmail: string;
  phone: string;
  address: string;
  description: string;
  whatsapp: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("StoreSetting")
      .upsert({
        id: "store-default",
        ...settings,
        updatedAt: new Date().toISOString()
      });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update store settings:", error);
    return { success: false, error: error.message || "স্টোর সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।" };
  }
}
