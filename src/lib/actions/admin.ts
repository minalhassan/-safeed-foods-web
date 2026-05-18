"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return { success: false, error: "You are not authenticated." };
    }

    const supabase = await createClient();

    const { data: user } = await supabase
      .from("User")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized." };
    }

    if (user.password !== currentPassword) {
      return { success: false, error: "Current password is incorrect." };
    }

    const { error: updateError } = await supabase
      .from("User")
      .update({ password: newPassword })
      .eq("id", userId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { success: false, error: "Failed to change password." };
  }
}
