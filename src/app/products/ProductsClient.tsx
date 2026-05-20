"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, Tag, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  image: string | null;
  stock: number;
  isFeatured: boolean;
  categoryId: string;
  category: Category;
  rating?: number; // fallback in card
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Sync selectedCategory with url query parameter
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory("all");
    }
  }, [catParam]);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    const params = new URLSearchParams(window.location.search);
    if (id === "all") {
      params.delete("category");
    } else {
      params.set("category", id);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // 1. Filter and sort products dynamically
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === "popular") {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-brand-soft/30 flex flex-col font-hind">

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-white border-b border-brand-black/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#2E7D32_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider">
            Premium Selection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-black font-noto leading-tight">
            আমাদের পণ্যসমূহ
          </h1>
          <p className="text-brand-black/50 max-w-xl mx-auto text-lg">
            বাগান থেকে সরাসরি বাছাইকৃত বিষমুক্ত, সতেজ এবং ১০০% খাঁটি খাদ্যসামগ্রী আপনার পরিবারের সুস্বাস্থ্যের নিশ্চয়তা।
          </p>
        </div>
      </section>

      {/* Main Shop Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="w-full lg:w-80 bg-white p-8 rounded-[2.5rem] shadow-premium border border-brand-black/5 space-y-8 shrink-0">
            <div className="flex items-center gap-3 pb-4 border-b border-brand-black/5">
              <SlidersHorizontal size={20} className="text-brand-primary" />
              <h2 className="text-xl font-bold text-brand-black font-noto">ফিল্টারসমূহ</h2>
            </div>

            {/* Live Search */}
            <div className="space-y-3">
              <h3 className="font-bold text-brand-black text-sm uppercase tracking-wider">পণ্য খুঁজুন</h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যেমন: আম, মধু..."
                  className="w-full pl-12 pr-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Categories Selector (Desktop Only) */}
            <div className="hidden lg:block space-y-3">
              <h3 className="font-bold text-brand-black text-sm uppercase tracking-wider">ক্যাটাগরি</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left border",
                    selectedCategory === "all"
                      ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]"
                      : "bg-white text-brand-black/70 border-brand-black/5 hover:border-brand-primary/20 hover:bg-brand-soft/50"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                    selectedCategory === "all"
                      ? "bg-white/20 border-white/10 text-white"
                      : "bg-brand-primary/5 border-brand-primary/10 text-brand-primary"
                  )}>
                    <LayoutGrid size={16} />
                  </div>
                  <span className="flex-1">সব ক্যাটাগরি</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left border",
                      selectedCategory === cat.id
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]"
                        : "bg-white text-brand-black/70 border-brand-black/5 hover:border-brand-primary/20 hover:bg-brand-soft/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-soft overflow-hidden relative shrink-0 border border-brand-black/10">
                      <Image
                        src={cat.image || "/mango.png"}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="flex-1">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Options */}
            <div className="space-y-3">
              <h3 className="font-bold text-brand-black text-sm uppercase tracking-wider">সাজান</h3>
              <div className="relative">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="default">ডিফল্ট</option>
                  <option value="popular">জনপ্রিয় পণ্য</option>
                  <option value="price-asc">দাম: কম থেকে বেশি</option>
                  <option value="price-desc">দাম: বেশি থেকে কম</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Horizontal Category Bar (Mobile/Tablet Only) */}
            <div 
              className="lg:hidden w-full overflow-x-auto pb-2 -mx-4 px-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="flex gap-3 min-w-max py-2">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all border shrink-0",
                    selectedCategory === "all"
                      ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                      : "bg-white text-brand-black/70 border-brand-black/5 hover:bg-brand-soft"
                  )}
                >
                  <LayoutGrid size={14} />
                  <span>সব ক্যাটাগরি</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all border shrink-0",
                      selectedCategory === cat.id
                        ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                        : "bg-white text-brand-black/70 border-brand-black/5 hover:bg-brand-soft"
                    )}
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-soft overflow-hidden relative shrink-0 border border-brand-black/5">
                      <Image
                        src={cat.image || "/mango.png"}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Header info */}
            <div className="flex items-center justify-between px-4">
              <p className="text-brand-black/40 text-sm font-medium">
                মোট <span className="text-brand-primary font-bold">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
              </p>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((prod) => (
                    <motion.div
                      layout
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProductCard
                        id={prod.id}
                        name={prod.name}
                        price={prod.price}
                        discountPrice={prod.discountPrice || undefined}
                        image={prod.image || "/mango.png"}
                        category={prod.category.name}
                        rating={prod.rating || 5}
                        stock={prod.stock}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center space-y-4"
                  >
                    <p className="text-2xl font-bold font-noto text-brand-black/30">দুঃখিত, কোনো পণ্য পাওয়া যায়নি!</p>
                    <p className="text-brand-black/40">অনুগ্রহ করে ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
