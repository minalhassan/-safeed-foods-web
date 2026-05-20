"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount?: number;
}

interface CategoriesProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100 
      } 
    },
  };

  return (
    <section id="categories" className="py-24 px-4 md:px-8 bg-white relative overflow-hidden">
      {/* Decorative leaf/organic backgrounds */}
      <div className="absolute -top-10 -left-10 w-40 h-40 opacity-5 pointer-events-none text-brand-primary">
        <Leaf size={160} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 font-hind">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider">
            Our Categories
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-black font-noto">
            পণ্য ক্যাটাগরিসমূহ
          </h2>
          <p className="text-brand-black/50 text-base md:text-lg font-medium">
            আমাদের সব তাজা ও ভেজালমুক্ত অর্গানিক পণ্যসমূহ সহজে খুঁজে পেতে নিচের ক্যাটাগরিগুলো থেকে বেছে নিন।
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={cardVariants} className="group">
              <Link href={`/products?category=${cat.id}`} className="block">
                <div className="relative h-80 rounded-[2.5rem] overflow-hidden shadow-premium border border-brand-black/5 bg-brand-soft hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-8">
                  {/* Category Image */}
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                    <Image
                      src={cat.image || "/mango.png"}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    />
                    {/* Premium Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent" />
                  </div>

                  {/* Content (Overlaid on Image) */}
                  <div className="relative z-10 space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block px-3 py-1 rounded-lg bg-brand-primary/80 backdrop-blur-md text-white text-xs font-bold">
                      {cat.productCount || 0} টি পণ্য
                    </span>
                    <h3 className="text-2xl font-bold text-white font-noto">
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-2 text-brand-primary-light font-bold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>পণ্যসমূহ দেখুন</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Border Highlight Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-brand-primary-light/30 rounded-[2.5rem] transition-colors duration-500 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
