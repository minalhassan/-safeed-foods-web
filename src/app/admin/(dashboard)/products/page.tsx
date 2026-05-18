import React from "react";
import { createClient } from "@/lib/supabase/server";
import ProductsAdminClient from "./ProductsAdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "পণ্য পরিচালনা | অ্যাডমিন প্যানেল",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Query live inventory data from Supabase
  const { data: productsData } = await supabase
    .from("Product")
    .select("*, category:Category(*)")
    .order("createdAt", { ascending: false });

  // Query live categories from Supabase
  const { data: categoriesData } = await supabase
    .from("Category")
    .select("*")
    .order("name", { ascending: true });

  const products = productsData || [];
  const categories = categoriesData || [];

  return (
    <ProductsAdminClient
      initialProducts={products as any}
      categories={categories as any}
    />
  );
}
