"use client";

import React, { useState, useMemo, useTransition } from "react";
import { Plus, Search, Filter, Edit, Trash2, Package, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/product";
import { createCategory, deleteCategory } from "@/lib/actions/category";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
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
}

interface ProductsAdminClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsAdminClient({ initialProducts, categories }: ProductsAdminClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  // Modals & Active Selections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Category management states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catFormName, setCatFormName] = useState("");
  const [catFormImage, setCatFormImage] = useState("/mango.png");
  const [isCatUploading, setIsCatUploading] = useState(false);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDiscountPrice, setFormDiscountPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setModalType("add");
    setSelectedProduct(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormDiscountPrice("");
    setFormStock("");
    setFormCategoryId(categoriesList[0]?.id || "");
    setFormImage("/mango.png");
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEdit = (prod: Product) => {
    setModalType("edit");
    setSelectedProduct(prod);
    setFormName(prod.name);
    setFormDescription(prod.description);
    setFormPrice(prod.price.toString());
    setFormDiscountPrice(prod.discountPrice?.toString() || "");
    setFormStock(prod.stock.toString());
    setFormCategoryId(prod.categoryId);
    setFormImage(prod.image || "/mango.png");
    setFormIsFeatured(prod.isFeatured);
    setIsModalOpen(true);
  };

  // Category Image Upload Handler
  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে শুধুমাত্র ছবি ফাইল আপলোড করুন!");
      return;
    }

    setIsCatUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCatFormImage(data.url);
        toast.success("ক্যাটাগরি ছবি সফলভাবে আপলোড করা হয়েছে!");
      } else {
        toast.error(data.error || "ছবি আপলোড করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Category upload error:", err);
      toast.error("সার্ভার সংযোগে ত্রুটি ঘটেছে!");
    } finally {
      setIsCatUploading(false);
    }
  };

  // Create Category Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) {
      toast.error("অনুগ্রহ করে ক্যাটাগরির নাম দিন।");
      return;
    }

    startTransition(async () => {
      const result = await createCategory({
        name: catFormName.trim(),
        image: catFormImage || "/mango.png",
      });

      if (result.success && result.category) {
        const newCat = result.category as Category;
        setCategoriesList([...categoriesList, newCat]);
        toast.success(`"${newCat.name}" ক্যাটাগরি সফলভাবে তৈরি করা হয়েছে!`);
        setCatFormName("");
        setCatFormImage("/mango.png");
        router.refresh();
      } else {
        toast.error(result.error || "ক্যাটাগরি তৈরি করতে ব্যর্থ হয়েছে।");
      }
    });
  };

  // Delete Category Handler
  const handleDeleteCategory = async (id: string, name: string) => {
    const check = window.confirm(`আপনি কি নিশ্চিতভাবে "${name}" ক্যাটাগরি মুছে ফেলতে চান?`);
    if (!check) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        setCategoriesList(categoriesList.filter((c) => c.id !== id));
        toast.success(`"${name}" ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে!`);
        router.refresh();
      } else {
        toast.error(result.error || "ক্যাটাগরি ডিলিট করতে ব্যর্থ হয়েছে।");
      }
    });
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে শুধুমাত্র ছবি ফাইল আপলোড করুন!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setFormImage(data.url);
        toast.success("ছবিটি সফলভাবে আপলোড করা হয়েছে!");
      } else {
        toast.error(data.error || "ছবি আপলোড করতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("সার্ভার সংযোগে ত্রুটি ঘটেছে!");
    } finally {
      setIsUploading(false);
    }
  };

  // Submit Add or Edit Product Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formPrice || !formStock || !formCategoryId) {
      toast.error("অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    const payload = {
      name: formName,
      description: formDescription,
      price: parseFloat(formPrice),
      discountPrice: formDiscountPrice ? parseFloat(formDiscountPrice) : null,
      stock: parseInt(formStock),
      categoryId: formCategoryId,
      image: formImage || "/mango.png",
      isFeatured: formIsFeatured,
    };

    startTransition(async () => {
      if (modalType === "add") {
        const result = await createProduct(payload);
        if (result.success && result.product) {
          setProducts([result.product as Product, ...products]);
          toast.success("নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!");
          setIsModalOpen(false);
          router.refresh(); // Clear Next.js client-side router cache instantly
        } else {
          toast.error(result.error || "পণ্য যোগ করতে ব্যর্থ হয়েছে।");
        }
      } else if (modalType === "edit" && selectedProduct) {
        const result = await updateProduct(selectedProduct.id, payload);
        if (result.success && result.product) {
          setProducts(products.map((p) => (p.id === selectedProduct.id ? (result.product as Product) : p)));
          toast.success("পণ্য সফলভাবে আপডেট করা হয়েছে!");
          setIsModalOpen(false);
          router.refresh(); // Clear Next.js client-side router cache instantly
        } else {
          toast.error(result.error || "পণ্য আপডেট করতে ব্যর্থ হয়েছে।");
        }
      }
    });
  };

  // Delete Product handler
  const handleDelete = (id: string, name: string) => {
    const doubleCheck = window.confirm(`আপনি কি নিশ্চিতভাবে "${name}" পণ্যটি মুছে ফেলতে চান?`);
    if (!doubleCheck) return;

    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
        toast.success("পণ্যটি সফলভাবে মুছে ফেলা হয়েছে!");
        router.refresh(); // Clear Next.js client-side router cache instantly
      } else {
        toast.error(result.error || "পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।");
      }
    });
  };

  // Live filter products in UI
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <div className="space-y-8 font-hind">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-black font-noto">পণ্য তালিকা</h1>
          <p className="text-brand-black/50 text-sm mt-1">ইনভেন্টরি এবং খামারের প্রিমিয়াম পণ্যসমূহ পরিচালনা করুন।</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="px-6 py-4 bg-white border-2 border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 rounded-2xl font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Filter size={18} />
            ক্যাটাগরি পরিচালনা
          </button>
          
          <button
            onClick={handleOpenAdd}
            className="px-6 py-4 gradient-organic text-white rounded-2xl font-bold flex items-center gap-2 shadow-premium hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={22} />
            নতুন পণ্য যোগ করুন
          </button>
        </div>
      </div>

      {/* Live Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-brand-black/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-black/20" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা ক্যাটাগরির নাম লিখে খুঁজুন..."
            className="w-full pl-14 pr-6 py-4 bg-brand-soft rounded-2xl border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Interactive Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-black/5 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-soft/50 border-b border-brand-black/5">
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest">পণ্য</th>
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest">ক্যাটাগরি</th>
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest">মূল্য</th>
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest">স্টক</th>
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-xs font-bold text-brand-black/40 uppercase tracking-widest text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-brand-soft/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-soft shrink-0 overflow-hidden relative border border-brand-black/5">
                          <Image src={product.image || "/mango.png"} alt={product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-brand-black leading-none mb-1 font-noto">{product.name}</p>
                          <p className="text-[10px] text-brand-black/30 font-bold uppercase tracking-wider">SKU: SF-{product.id.slice(0, 4).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-brand-black/60 bg-brand-soft px-3 py-1.5 rounded-xl font-noto">
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-brand-primary">৳{product.price}</span>
                        {product.discountPrice && (
                          <span className="text-xs text-brand-black/30 line-through">৳{product.discountPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn("text-sm font-bold", product.stock > 10 ? "text-brand-black/60" : "text-red-500")}>
                        {product.stock} টি
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-2",
                          product.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", product.stock > 0 ? "bg-green-600" : "bg-red-600")} />
                        {product.stock > 0 ? "Active" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand-black/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                          title="পণ্য পরিবর্তন"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand-black/30 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-brand-black/20">
                      <Package size={64} strokeWidth={1} />
                      <p className="font-bold text-lg">কোনো পণ্য পাওয়া যায়নি</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Management Drawer Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-end font-hind font-medium">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCatModalOpen(false)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-brand-black/5">
                <h2 className="text-2xl font-bold text-brand-black font-noto">ক্যাটাগরি পরিচালনা</h2>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-black/40 hover:bg-brand-black/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Add New Category Form */}
              <div className="py-6 border-b border-brand-black/5">
                <h3 className="text-sm font-bold text-brand-black/70 mb-4 font-noto">নতুন ক্যাটাগরি যোগ করুন</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  {/* Category Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/50">ক্যাটাগরির নাম *</label>
                    <input
                      type="text"
                      required
                      value={catFormName}
                      onChange={(e) => setCatFormName(e.target.value)}
                      placeholder="যেমন: ঘি, মধু, ড্রাই ফ্রুটস..."
                      className="w-full px-4 py-3 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none text-sm font-medium"
                    />
                  </div>

                  {/* Device Upload for Category Icon */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/50 block">ক্যাটাগরি ছবি *</label>
                    <div className="flex items-center gap-4">
                      {/* Preview Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-brand-soft border border-brand-black/5 shrink-0 overflow-hidden relative flex items-center justify-center text-brand-black/20">
                        {catFormImage ? (
                          <Image src={catFormImage} alt="Cat Preview" fill className="object-cover" />
                        ) : (
                          <Package size={24} strokeWidth={1.5} />
                        )}
                        {isCatUploading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                            <Loader2 className="animate-spin text-brand-primary" size={16} />
                          </div>
                        )}
                      </div>

                      {/* Upload Box */}
                      <div className="flex-1">
                        <label className="relative flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-brand-black/10 hover:border-brand-primary rounded-xl cursor-pointer hover:bg-brand-soft/20 transition-all text-center px-4">
                          <span className="text-[10px] font-bold text-brand-primary">ছবি আপলোড করুন</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCatImageUpload}
                            className="hidden"
                            disabled={isCatUploading}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 gradient-organic text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    {isPending && <Loader2 className="animate-spin" size={16} />}
                    ক্যাটাগরি তৈরি করুন
                  </button>
                </form>
              </div>

              {/* Categories list */}
              <div className="flex-1 py-6 flex flex-col min-h-0">
                <h3 className="text-sm font-bold text-brand-black/70 mb-4 font-noto">বিদ্যমান ক্যাটাগরিসমূহ</h3>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0">
                  {categoriesList.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3.5 bg-brand-soft/50 rounded-2xl border border-brand-black/5 hover:border-brand-primary/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden relative border border-brand-black/5">
                          <Image src={cat.image || "/mango.png"} alt={cat.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-black font-noto leading-none mb-1">{cat.name}</p>
                          <p className="text-[9px] text-brand-black/30 font-bold uppercase tracking-wider">slug: {cat.slug}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-brand-black/30 hover:text-red-500 hover:bg-red-50 transition-all border border-brand-black/5 cursor-pointer"
                        title="ক্যাটাগরি মুছুন"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit/Add Dynamic Drawer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-end font-hind">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-white shadow-2xl p-8 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-6 border-b border-brand-black/5">
                <h2 className="text-2xl font-bold text-brand-black font-noto">
                  {modalType === "add" ? "নতুন পণ্য যোগ করুন" : "পণ্য পরিবর্তন করুন"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand-black/40 hover:bg-brand-black/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 py-8 space-y-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-black/70">পণ্যের নাম *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="যেমন: গোপালভোগ আম"
                    className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-black/70">পণ্যের বিবরণ</label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="পণ্যের গুণাগুণ ও বৈশিষ্ট্য লিখুন..."
                    className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-black/70">মূল্য (৳) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      min={0}
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="যেমন: ৳৫০০"
                      className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium"
                    />
                  </div>

                  {/* Discount Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-black/70">ছাড়ের মূল্য (৳)</label>
                    <input
                      type="number"
                      step="any"
                      min={0}
                      value={formDiscountPrice}
                      onChange={(e) => setFormDiscountPrice(e.target.value)}
                      placeholder="ঐচ্ছিক"
                      className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-black/70">স্টক পরিমাণ *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      placeholder="যেমন: ১০০"
                      className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-black/70">ক্যাটাগরি *</label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full px-4 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-medium cursor-pointer"
                    >
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Premium Image Upload from Device */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-brand-black/70 block font-noto">পণ্যের ছবি *</label>

                  <div className="flex items-center gap-6">
                    {/* Live Thumbnail Preview */}
                    <div className="w-24 h-24 rounded-2xl bg-brand-soft border border-brand-black/5 shrink-0 overflow-hidden relative flex items-center justify-center text-brand-black/20">
                      {formImage ? (
                        <Image src={formImage} alt="Preview" fill className="object-cover" />
                      ) : (
                        <Package size={32} strokeWidth={1.5} />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                          <Loader2 className="animate-spin text-brand-primary" size={24} />
                        </div>
                      )}
                    </div>

                    {/* Styled Upload Input Box */}
                    <div className="flex-1">
                      <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-brand-black/10 hover:border-brand-primary rounded-2xl cursor-pointer hover:bg-brand-soft/20 transition-all text-center px-4">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Plus size={20} className="text-brand-primary" />
                          <span className="text-xs font-bold text-brand-black/60 font-noto">ডিভাইস থেকে ছবি আপলোড করুন</span>
                          <span className="text-[10px] text-brand-black/30">PNG, JPG, WEBP (সর্বোচ্চ 5MB)</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Manual Path Overwrite */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-brand-black/30 font-bold uppercase tracking-wider font-noto">ছবির ফাইল পাথ</span>
                    <input
                      type="text"
                      required
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="যেমন: /mango.png"
                      className="w-full px-4 py-2.5 bg-brand-soft border border-transparent focus:border-brand-primary/20 focus:bg-white rounded-xl transition-all outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Is Featured */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-brand-primary cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-brand-black/70 cursor-pointer">
                    হোমপেজে জনপ্রিয় পণ্য হিসেবে দেখান
                  </label>
                </div>

                {/* Action CTA Buttons */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-brand-soft text-brand-black/60 rounded-2xl font-bold hover:bg-brand-black/5 transition-all text-center"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-4 gradient-organic text-white rounded-2xl font-bold shadow-premium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isPending && <Loader2 className="animate-spin" size={18} />}
                    {modalType === "add" ? "সংরক্ষণ করুন" : "পরিবর্তনগুলো সেভ করুন"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
