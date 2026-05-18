import React from "react";
import Image from "next/image";

export default function SafeedLogo({ 
  size = 48, 
  className = "",
  variant = "light"
}: { 
  size?: number; 
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <div 
      className={`relative rounded-xl overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Safeed Foods"
        width={size}
        height={size}
        className="object-contain"
        style={{ width: "100%", height: "100%" }}
        priority
      />
    </div>
  );
}
