"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Volume2,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/lib/actions/auth";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Hero Slider", href: "/admin/hero", icon: ImageIcon },
  { name: "Announcements", href: "/admin/announcements", icon: Volume2 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState<string>("CUSTOMER");

  useEffect(() => {
    async function loadRole() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setRole(currentUser.role);
      }
    }
    loadRole();
  }, []);

  const handleLogout = () => {
    // Clear cookie (in a real app, use a server action)
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const allowedLinks = sidebarLinks.filter((link) => {
    if (role === "ADMIN") return true;
    if (role === "CO_ADMIN") {
      // Co-Admin has access to Dashboard, Products, Orders, Hero Slider, Announcements (no Settings, no Users)
      return (
        link.href === "/admin" ||
        link.href === "/admin/products" ||
        link.href === "/admin/orders" ||
        link.href === "/admin/hero" ||
        link.href === "/admin/announcements"
      );
    }
    if (role === "EDITOR") {
      // Editor has access only to Dashboard, Products, Hero Slider, Announcements (no Orders, no Settings, no Users)
      return (
        link.href === "/admin" ||
        link.href === "/admin/products" ||
        link.href === "/admin/hero" ||
        link.href === "/admin/announcements"
      );
    }
    return link.href === "/admin";
  });

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-6 left-6 z-[60] p-3 bg-white rounded-xl shadow-lg border border-brand-black/5 text-brand-black"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-brand-black/5 transition-transform duration-500 lg:translate-x-0 shadow-xl lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-8">
          <Link href="/admin" className="flex items-center gap-3 mb-12 px-2 group">
            <div className="w-10 h-10 gradient-organic rounded-xl flex items-center justify-center shadow-premium rotate-3 group-hover:rotate-0 transition-transform">
              <span className="text-white font-bold text-xl font-noto">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-brand-black font-black text-xl leading-none font-noto">SAFEED</span>
              <span className="text-brand-black/40 text-[10px] tracking-widest font-bold">ADMIN</span>
            </div>
          </Link>

          <nav className="flex-1 space-y-2">
            {allowedLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold font-hind",
                  pathname === link.href 
                    ? "bg-brand-primary text-white shadow-premium translate-x-2" 
                    : "text-brand-black/40 hover:bg-brand-soft hover:text-brand-primary hover:translate-x-1"
                )}
              >
                <link.icon size={22} />
                {link.name}
              </Link>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold font-hind mt-auto"
          >
            <LogOut size={22} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
