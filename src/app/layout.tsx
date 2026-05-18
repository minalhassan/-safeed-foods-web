import type { Metadata } from "next";
import { Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
});

const notoBengali = Noto_Sans_Bengali({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-noto-bengali",
});

export const metadata: Metadata = {
  title: "Safeed Foods | Premium Organic Food & Orchard Fresh Fruits",
  description: "Experience the purity of nature with Safeed Foods. Premium quality, chemical-free fruits and organic products delivered directly from our orchard to your home.",
  keywords: ["organic food", "fresh fruits", "mango", "safeed foods", "bangladesh", "premium food"],
};

import StoreWrapper from "@/components/layout/store-wrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${notoBengali.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-hind selection:bg-[#2E7D32] selection:text-white">
        <CartProvider>
          <StoreWrapper>
            {children}
          </StoreWrapper>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
