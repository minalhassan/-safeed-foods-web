"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper function to check if the current user is an Admin
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) return false;

    const supabase = await createClient();
    const { data: user } = await supabase
      .from("User")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
}

// Helper to generate a URL slug from a name
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0980-\u09FF\s-]/g, "") // support Bengali characters
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 1. Create Product
export async function createProduct(formData: {
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  categoryId: string;
  image?: string | null;
  isFeatured?: boolean;
}) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিনরা পণ্য যোগ করতে পারবেন।" };
    }

    const slug = generateSlug(formData.name);
    const supabase = await createClient();

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("Product")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    const uniqueSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const { data: product, error: insertError } = await supabase
      .from("Product")
      .insert({
        id: crypto.randomUUID(),
        name: formData.name,
        slug: uniqueSlug,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        image: formData.image || "/mango.png",
        isFeatured: formData.isFeatured || false,
      })
      .select("*, category:Category(*)")
      .single();

    if (insertError || !product) {
      throw new Error(insertError?.message || "Failed to create product record.");
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "পণ্য যোগ করতে ব্যর্থ হয়েছে।" };
  }
}

// 2. Update Product
export async function updateProduct(
  id: string,
  formData: {
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    categoryId: string;
    image?: string | null;
    isFeatured?: boolean;
  }
) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিনরা পণ্য পরিবর্তন করতে পারবেন।" };
    }

    const supabase = await createClient();

    const { data: product } = await supabase
      .from("Product")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!product) {
      return { success: false, error: "পণ্যটি খুঁজে পাওয়া যায়নি।" };
    }

    let uniqueSlug = product.slug;
    if (product.name !== formData.name) {
      const slug = generateSlug(formData.name);
      const { data: existing } = await supabase
        .from("Product")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      uniqueSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
    }

    const { data: updated, error: updateError } = await supabase
      .from("Product")
      .update({
        name: formData.name,
        slug: uniqueSlug,
        description: formData.description,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        image: formData.image || "/mango.png",
        isFeatured: formData.isFeatured || false,
      })
      .eq("id", id)
      .select("*, category:Category(*)")
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message || "Failed to update product record.");
    }

    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, product: updated };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "পণ্য আপডেট করতে ব্যর্থ হয়েছে।" };
  }
}

// 3. Delete Product
export async function deleteProduct(id: string) {
  try {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return { success: false, error: "অননুমোদিত অ্যাক্সেস! শুধুমাত্র অ্যাডমিনরা পণ্য মুছে ফেলতে পারবেন।" };
    }

    const supabase = await createClient();

    const { error: deleteError } = await supabase
      .from("Product")
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
    console.error("Failed to delete product:", error);
    return { success: false, error: "পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।" };
  }
}
