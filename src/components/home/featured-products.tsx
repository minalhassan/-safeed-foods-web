import React from "react";
import ProductCard from "@/components/ui/product-card";
import { createClient } from "@/lib/supabase/server";
import { Product, Category } from "@/types/database";

type ProductWithCategory = Product & { category: Category };

export default async function FeaturedProducts() {
  // Fetch real products from database with explicit typing
  let products: ProductWithCategory[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Product")
      .select("*, category:Category(*)")
      .eq("isFeatured", true)
      .limit(8);

    if (error) throw error;
    products = (data || []) as unknown as ProductWithCategory[];
  } catch (error) {
    console.error("Database connection error in FeaturedProducts:", error);
    products = [];
  }

  return (
    <section id="products" className="py-24 px-4 md:px-8 bg-brand-soft/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-sm font-hind">
              Fresh From Orchard
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-black font-noto">
              আমাদের সেরা পণ্যসমূহ
            </h2>
          </div>
          <div>
            <button className="text-brand-primary font-bold hover:underline transition-all font-hind flex items-center gap-2">
              সবগুলো দেখুন
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length > 0 ? products.map((product) => (
            <div key={product.id}>
              <ProductCard 
                id={product.id}
                name={product.name}
                price={product.price}
                discountPrice={product.discountPrice ?? undefined}
                image={product.image || "/mango.png"}
                category={product.category.name}
                stock={product.stock}
                rating={5} // Placeholder rating
              />
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-brand-black/20">
              কোন পণ্য পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
