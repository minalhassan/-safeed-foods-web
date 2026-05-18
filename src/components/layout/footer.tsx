"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import SafeedLogo from "@/components/ui/safeed-logo";
import { Phone, Mail, MapPin } from "lucide-react";
import { getStoreSettings } from "@/lib/actions/settings";

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);

export default function Footer() {
  const [store, setStore] = useState({
    storeName: "Safeed Foods",
    storeEmail: "info@safeedfoods.com",
    phone: "+৮৮০ ১৫৭০ ২৬২৮৬০",
    address: "রাজশাহী, বাংলাদেশ",
    description: "সরাসরি বাগান থেকে বাছাইকৃত কেমিক্যালমুক্ত ও স্বাস্থ্যসম্মত প্রিমিয়াম কোয়ালিটি ফল এবং অর্গানিক পণ্য আপনার দরজায় পৌঁছে দেয় সেফীড ফুডস।"
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getStoreSettings();
        if (data) {
          setStore({
            storeName: data.storeName || "Safeed Foods",
            storeEmail: data.storeEmail || "info@safeedfoods.com",
            phone: data.phone || "+৮৮০ ১৫৭০ ২৬২৮৬০",
            address: data.address || "রাজশাহী, বাংলাদেশ",
            description: data.description || "সরাসরি বাগান থেকে বাছাইকৃত কেমিক্যালমুক্ত ও স্বাস্থ্যসম্মত প্রিমিয়াম কোয়ালিটি ফল এবং অর্গানিক পণ্য আপনার দরজায় পৌঁছে দেয় সেফীড ফুডস।"
          });
        }
      } catch (error) {
        console.error("Failed to load footer dynamic store contact:", error);
      }
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-brand-black text-brand-cream pt-20 pb-10 px-4 md:px-8 font-hind relative overflow-hidden">
      {/* Decorative organic background */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.02] pointer-events-none"
           style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/leaf.png')" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <SafeedLogo size={56} />
            </Link>
            <p className="text-white/60 leading-relaxed text-lg font-hind">
              {store.description}
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: FacebookIcon, href: "https://www.facebook.com/share/18Uhe1FewQ/", color: "hover:bg-[#1877F2]" },
                { icon: InstagramIcon, href: "#", color: "hover:bg-[#E4405F]" },
                { icon: YoutubeIcon, href: "#", color: "hover:bg-[#FF0000]" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color}`}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-8 font-noto relative inline-block">
              প্রয়োজনীয় লিংক
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-brand-primary rounded-full" />
            </h3>
            <ul className="space-y-4 text-white/60">
              {[
                { name: "পণ্যসমূহ", href: "/#products" },
                { name: "ক্যাটাগরি", href: "/#products" },
                { name: "আমাদের সম্পর্কে", href: "/#about" },
                { name: "গ্রাহক রিভিউ", href: "/#reviews" },
                { name: "যোগাযোগ", href: "/#about" }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-xl mb-8 font-noto relative inline-block">
              সহায়তা
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-brand-primary rounded-full" />
            </h3>
            <ul className="space-y-4 text-white/60">
              {["সচরাচর জিজ্ঞাসা", "শর্তাবলী", "প্রাইভেসি পলিসি", "ডেলিভারি তথ্য", "রিফান্ড পলিসি"].map((item, i) => (
                <li key={i}>
                  <Link href="#" className="hover:text-brand-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-xl mb-8 font-noto relative inline-block">
              যোগাযোগ করুন
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-brand-primary rounded-full" />
            </h3>
            <ul className="space-y-5 text-white/60">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                  <MapPin size={20} className="text-brand-primary" />
                </div>
                <span>{store.address}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                  <Phone size={20} className="text-brand-primary" />
                </div>
                <span>{store.phone}</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                  <Mail size={20} className="text-brand-primary" />
                </div>
                <span>{store.storeEmail}</span>
              </li>
            </ul>
            
            <div className="pt-6">
              <h4 className="text-white/40 text-xs font-bold mb-4 uppercase tracking-[0.2em]">পেমেন্ট মেথড</h4>
              <div className="flex flex-wrap gap-3 opacity-60">
                {["bKash", "Nagad", "Rocket", "VISA", "MasterCard"].map((method) => (
                  <div key={method} className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/20 transition-colors">
                    <span className="text-white text-[10px] font-bold">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm font-medium">
          <p>© 2026 <span className="text-white">{store.storeName}</span>। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-8">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
          <p 
            className="flex items-center gap-2 text-white"
            data-dev="Md.Minal Hasan Raj Mim"
            data-contact="minalhasan2@gmail.com"
          >
            Crafted by 
            <a href="https://github.com/minalhassan" target="_blank" rel="noopener noreferrer" className="text-brand-primary-light hover:underline">Md.Minal Hasan Raj Mim</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
