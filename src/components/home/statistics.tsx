import React from "react";

const stats = [
  { label: "৫০০০+", sub: "খুশি গ্রাহক" },
  { label: "২০+", sub: "অর্গানিক আইটেম" },
  { label: "৫০+", sub: "নিজস্ব বাগান" },
  { label: "১০০%", sub: "নিরাপদ খাদ্য" },
];

export default function Statistics() {
  return (
    <div className="bg-white py-12 md:py-20 border-b border-brand-black/5 relative overflow-hidden">
      {/* Subtle organic background pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(#2e7d32 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center space-y-2 group">
            <p className="text-3xl md:text-6xl font-bold text-brand-primary font-noto transition-transform group-hover:scale-110 duration-500">
              {stat.label}
            </p>
            <p className="text-brand-black/50 font-hind font-medium uppercase tracking-widest text-xs md:text-sm">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
