import Hero from "@/components/home/hero";
import FeaturedProducts from "@/components/home/featured-products";
import FarmStory from "@/components/home/farm-story";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
import Statistics from "@/components/home/statistics";
import AnnouncementBar from "@/components/layout/announcement-bar";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { Phone } from "lucide-react";
import { getStoreSettings } from "@/lib/actions/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = await getStoreSettings();
  const whatsapp = store?.whatsapp || "8801570262860";

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <Hero />
        <Statistics />
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
