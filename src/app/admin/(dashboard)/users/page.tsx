import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UsersList from "./UsersList";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  // Verify the role of the user requesting this page
  const { data: activeUser } = await supabase
    .from("User")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  // Only the main ADMIN role is authorized to view registered users
  if (!activeUser || activeUser.role !== "ADMIN") {
    redirect("/admin");
  }

  // Query all users from database ordered by registration date
  const { data: users, error } = await supabase
    .from("User")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch users for admin panel:", error);
  }

  const allUsers = users || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">User Directory</h1>
        <p className="text-brand-black/50 text-sm">View, search, and manage all registered customers and administrators.</p>
      </div>

      <UsersList initialUsers={allUsers} />
    </div>
  );
}
