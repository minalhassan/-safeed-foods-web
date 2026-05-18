"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Utility to verify if the requesting session is Admin
async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient();
    
    // Check local database-backed session cookie (used by local admin dashboard)
    const userId = cookieStore.get("user_id")?.value;
    if (userId) {
      const { data: user } = await supabase
        .from("User")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (user?.role === "ADMIN") return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Category auth check failed:", error);
    return false;
  }
}

// Generate simple URL slugs
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\u0980-\u09FF-]+/g, "") // Keep alphanumeric, Bengali characters and -
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

// 1. Create a New Category
export async function createCategory(formData: {
  name: string;
  image?: string | null;
}) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিনরা ক্যাটাগরি তৈরি করতে পারবেন।" };
    }

    const { name, image } = formData;
    if (!name) {
      return { success: false, error: "ক্যাটাগরির নাম দেওয়া আবশ্যক।" };
    }

    const slug = generateSlug(name);
    const supabase = await createClient();

    // Check for duplicate category name/slug
    const { data: existing } = await supabase
      .from("Category")
      .select("*")
      .or(`name.eq."${name}",slug.eq."${slug}"`)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "এই নামের ক্যাটাগরি ইতিমধ্যে তৈরি করা আছে।" };
    }

    // Create record
    const { data: category, error: insertError } = await supabase
      .from("Category")
      .insert({
        id: crypto.randomUUID(),
        name,
        slug,
        image: image || "/mango.png"
      })
      .select("*")
      .single();

    if (insertError || !category) {
      throw new Error(insertError?.message || "Failed to create category record.");
    }

    // Revalidate storefront path caches
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, category };
  } catch (error) {
    console.error("❌ Failed to create category:", error);
    return { success: false, error: "ক্যাটাগরি তৈরি করতে সার্ভার সংযোগে সমস্যা হয়েছে।" };
  }
}

// 2. Delete an Existing Category
export async function deleteCategory(id: string) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিনরা ক্যাটাগরি ডিলিট করতে পারবেন।" };
    }

    const supabase = await createClient();

    // Check if any product is currently linked to this category
    const { data: productsUsing } = await supabase
      .from("Product")
      .select("id")
      .eq("categoryId", id)
      .limit(1)
      .maybeSingle();

    if (productsUsing) {
      return { 
        success: false, 
        error: "এই ক্যাটাগরিটি মুছে ফেলা যাবে না! এর অধীনে সক্রিয় পণ্যসমূহ রয়েছে। প্রথমে সেই পণ্যগুলোর ক্যাটাগরি পরিবর্তন বা ডিলিট করুন।" 
      };
    }

    const { error: deleteError } = await supabase
      .from("Category")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete category:", error);
    return { success: false, error: "ক্যাটাগরি ডিলিট করতে সার্ভার সংযোগে সমস্যা হয়েছে।" };
  }
}
