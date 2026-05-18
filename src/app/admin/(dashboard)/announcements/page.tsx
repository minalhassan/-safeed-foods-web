import React from "react";
import { getAnnouncement } from "@/lib/actions/announcement";
import AnnouncementForm from "./AnnouncementForm";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  const announcement = await getAnnouncement();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Announcement Management</h1>
        <p className="text-brand-black/50 text-sm">Manage the sliding notice banner visible on your storefront header.</p>
      </div>

      <AnnouncementForm initialData={announcement} />
    </div>
  );
}
