import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "পণ্যসমূহ | Safeed Foods",
  description: "আমাদের শতভাগ খাঁটি ও কেমিক্যালমুক্ত প্রিমিয়াম অর্গানিক পণ্যের তালিকা দেখুন। সরাসরি রাজশাহী ও দেশের অন্যান্য প্রান্ত থেকে সংগৃহীত।",
};

export default async function ProductsPage() {
  const supabase = await createClient();

  // Fetch products and categories from Supabase on the server
  const { data: productsData } = await supabase
    .from("Product")
    .select("*, category:Category(*)")
    .order("createdAt", { ascending: false });

  const { data: categoriesData } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  const products = productsData || [];
  const categories = categoriesData || [];

  return (
    <ProductsClient 
      initialProducts={products as any}
      categories={categories as any}
    />
  );
}
