import { createClient } from "@/lib/supabase/server";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

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
    <Suspense fallback={
      <div className="min-h-screen bg-brand-soft/30 flex items-center justify-center font-hind">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
          <p className="text-brand-black/50 font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    }>
      <ProductsClient 
        initialProducts={products as any}
        categories={categories as any}
      />
    </Suspense>
  );
}
