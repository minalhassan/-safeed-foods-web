"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ShoppingCart, Phone, Star, ShieldCheck, Truck, RefreshCw, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { getStoreSettings } from "@/lib/actions/settings";

// Mock data (would be fetched based on id)
const product = {
  id: "1",
  name: "প্রিমিয়াম গোপালভোগ আম",
  price: 350,
  discountPrice: 280,
  images: ["/mango.png", "/hero-1.png", "/nuts.png"],
  category: "আম",
  rating: 5,
  reviews: 124,
  stock: 20,
  description: "রাজশাহীর বাগান থেকে সরাসরি সংগৃহীত প্রিমিয়াম গোপালভোগ আম। কোনো প্রকার কেমিক্যাল বা কার্বাইড ব্যবহার করা হয়নি। অত্যন্ত মিষ্টি এবং সুস্বাদু এই আম আপনার পরিবারের সবার জন্য নিরাপদ।",
  benefits: ["১০০% কেমিক্যালমুক্ত", "সরাসরি বাগান থেকে বাছাইকৃত", "প্রাকৃতিক উপায়ে পাকানো", "সর্বোচ্চ পুষ্টিগুণ সম্পন্ন"],
};

export default function ProductPage() {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [whatsapp, setWhatsapp] = useState<string>("8801570262860");

  useEffect(() => {
    async function loadWhatsapp() {
      try {
        const store = await getStoreSettings();
        if (store && store.whatsapp) {
          setWhatsapp(store.whatsapp);
        }
      } catch (error) {
        console.error("Failed to load product details dynamic whatsapp:", error);
      }
    }
    loadWhatsapp();
  }, []);

  const whatsappMessage = `আসসালামু আলাইকুম, আমি Safeed Foods থেকে ${product.name} (${quantity} টি) অর্ডার করতে চাই।`;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images[0],
      quantity: quantity,
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };

  return (
    <main className="min-h-screen bg-brand-soft/30">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto font-hind">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery Side */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-white shadow-premium border border-brand-black/5"
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all",
                    activeImage === idx ? "border-brand-primary" : "border-transparent opacity-60"
                  )}
                >
                  <Image src={img} alt={product.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-brand-black font-noto leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-brand-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-brand-black/40 text-sm font-medium">({product.reviews} টি কাস্টমার রিভিউ)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-brand-primary">৳{product.discountPrice || product.price}</span>
              {product.discountPrice && (
                <span className="text-xl text-brand-black/20 line-through">৳{product.price}</span>
              )}
            </div>

            <p className="text-brand-black/60 text-lg leading-relaxed">
              {product.description}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3 text-brand-black/70">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <ShieldCheck size={14} />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>

            <hr className="border-brand-black/5" />

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-brand-black/10 rounded-2xl p-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-brand-black/60 hover:text-brand-primary transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-brand-black/60 hover:text-brand-primary transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-sm text-brand-black/40 font-medium">
                  স্টক আছে: <span className="text-brand-primary">{product.stock} কেজি</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-5 gradient-organic text-white rounded-2xl font-bold text-lg shadow-premium hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.5)] transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} />
                  কার্টে যোগ করুন
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-5 glass text-brand-black rounded-2xl font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-3"
                >
                  <Phone className="text-brand-primary" size={24} />
                  WhatsApp অর্ডার
                </a>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              {[
                { icon: Truck, label: "ফাস্ট ডেলিভারি", sub: "৪৮ ঘন্টার মধ্যে" },
                { icon: RefreshCw, label: "সহজ রিটার্ন", sub: "৭ দিনের গ্যারান্টি" },
                { icon: ShieldCheck, label: "সুরক্ষিত পেমেন্ট", sub: "বিকাশ ও নগদ" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-brand-black/5">
                  <item.icon className="text-brand-primary mb-3" size={24} />
                  <p className="font-bold text-sm text-brand-black font-noto">{item.label}</p>
                  <p className="text-[10px] text-brand-black/40 uppercase tracking-wider">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
