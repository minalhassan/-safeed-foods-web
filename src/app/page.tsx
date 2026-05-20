import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/featured-products";
import FarmStory from "@/components/home/farm-story";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
import Statistics from "@/components/home/statistics";
import CategoriesSection from "@/components/home/categories";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { Phone } from "lucide-react";
import { getStoreSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = await getStoreSettings();
  const whatsapp = store?.whatsapp || "8801570262860";

  // Fetch categories and map counts
  let categories: any[] = [];
  try {
    const supabase = await createClient();
    
    // Fetch categories ordered by name
    const { data: categoriesData } = await supabase
      .from("Category")
      .select("*")
      .order("name", { ascending: true });

    // Fetch product category IDs to aggregate counts
    const { data: productsData } = await supabase
      .from("Product")
      .select("categoryId");

    const categoryCounts = (productsData || []).reduce((acc: Record<string, number>, p: any) => {
      if (p.categoryId) {
        acc[p.categoryId] = (acc[p.categoryId] || 0) + 1;
      }
      return acc;
    }, {});

    categories = (categoriesData || []).map((cat: any) => ({
      ...cat,
      productCount: categoryCounts[cat.id] || 0,
    }));
  } catch (error) {
    console.error("Database connection error in HomePage category fetch:", error);
    categories = [];
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <Hero />
        <Statistics />
        <CategoriesSection categories={categories} />
        <FeaturedProducts />
        <FarmStory />
        <Testimonials />
        <Newsletter />

        {/* WhatsApp Float Button (Mobile) */}
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform md:hidden animate-bounce"
        >
          <Phone size={24} fill="currentColor" />
        </a>

        {/* Global Scroll to Top */}
        <ScrollToTop />
      </div>
    </div>
  );
}
