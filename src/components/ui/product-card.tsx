"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { getStoreSettings } from "@/lib/actions/settings";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
}

export default function ProductCard({
  id,
  name,
  price,
  discountPrice,
  image,
  category,
  rating,
  stock,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [whatsapp, setWhatsapp] = useState<string>("8801570262860");

  useEffect(() => {
    async function loadWhatsapp() {
      try {
        const store = await getStoreSettings();
        if (store && store.whatsapp) {
          setWhatsapp(store.whatsapp);
        }
      } catch (error) {
        console.error("Failed to load product card dynamic whatsapp:", error);
      }
    }
    loadWhatsapp();
  }, []);

  const whatsappMessage = `আসসালামু আলাইকুম, আমি Safeed Foods থেকে ${name} অর্ডার করতে চাই।`;
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price: discountPrice || price,
      image,
      quantity: 1,
    });
    toast.success(`${name} কার্টে যোগ করা হয়েছে!`);
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-premium border border-brand-black/5 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-brand-soft">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-wider shadow-sm font-hind">
            {category}
          </span>
          {discountPrice && (
            <span className="bg-brand-accent px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm font-hind">
              Sale
            </span>
          )}
        </div>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-brand-primary-light transition-colors font-hind"
          >
            <ShoppingCart size={18} />
            কার্টে নিন
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 gap-3 font-hind">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={cn(i < rating ? "fill-brand-accent text-brand-accent" : "text-brand-black/10")}
            />
          ))}
          <span className="text-xs text-brand-black/40 ml-1">({rating}.0)</span>
        </div>

        <Link href={`/products/${id}`} className="block">
          <h3 className="text-xl font-bold text-brand-black group-hover:text-brand-primary transition-colors line-clamp-1 font-noto">
            {name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {discountPrice ? (
              <>
                <span className="text-2xl font-bold text-brand-primary">৳{discountPrice}</span>
                <span className="text-sm text-brand-black/30 line-through">৳{price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-brand-primary">৳{price}</span>
            )}
          </div>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-brand-soft border border-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            title="WhatsApp অর্ডার"
          >
            <Phone size={18} />
          </a>
        </div>

        <div className="pt-3 border-t border-brand-black/5 flex items-center justify-between">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
            stock > 0 ? "text-brand-primary" : "text-red-500"
          )}>
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <span className="text-[10px] text-brand-black/30">SKU: SF-{id.slice(0, 4)}</span>
        </div>
      </div>
    </motion.div>
  );
}
