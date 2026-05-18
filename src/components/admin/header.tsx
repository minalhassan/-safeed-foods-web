"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";

export default function AdminHeader({ adminName }: { adminName: string }) {
  const initials = adminName ? adminName.split(' ').map(n => n[0]).join('').toUpperCase() : "A";

  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-brand-black/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="relative hidden md:block w-full max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-black/20" size={20} />
        <input
          type="text"
          placeholder="Search products, orders, analytics..."
          className="w-full pl-14 pr-6 py-4 bg-brand-soft rounded-2xl border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-sm font-medium"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <button className="w-12 h-12 bg-brand-soft rounded-2xl flex items-center justify-center text-brand-black/40 hover:text-brand-primary hover:bg-brand-primary/5 transition-all relative">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-brand-black/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-brand-black leading-none mb-1">{adminName}</p>
            <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-[0.2em]">Super Admin</p>
          </div>
          <div className="w-12 h-12 rounded-2xl gradient-organic flex items-center justify-center text-white font-bold shadow-premium">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
