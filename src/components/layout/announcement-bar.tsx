"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAnnouncement } from "@/lib/actions/announcement";

export default function AnnouncementBar() {
  const [announcementText, setAnnouncementText] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    async function loadAnnouncement() {
      const data = await getAnnouncement();
      setAnnouncementText(data.text);
      setIsActive(data.isActive);
    }
    loadAnnouncement();
  }, []);

  if (!isActive || !announcementText) return null;

  // Split text by pipe "|" symbol to display separate slides
  const slides = announcementText.split("|").map(t => t.trim()).filter(Boolean);

  if (slides.length === 0) return null;

  return (
    <div className="bg-brand-primary text-white py-2.5 px-4 overflow-hidden relative z-[60]">
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear",
        }}
        className="whitespace-nowrap flex items-center gap-12 text-sm font-hind font-medium tracking-wide"
      >
        {slides.map((slide, idx) => (
          <span key={idx} className="inline-flex items-center gap-2">
            {slide}
          </span>
        ))}
        {/* Repeat slides for seamless looping */}
        {slides.map((slide, idx) => (
          <span key={`dup-${idx}`} className="inline-flex items-center gap-2">
            {slide}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
