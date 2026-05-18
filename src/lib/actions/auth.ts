"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Role } from "@/types/database";

export async function register(formData: any) {
  try {
    const { name, email, phone, password, address } = formData;
    const supabase = await createClient();

    // Auto-generate fallback email if optional field is left blank (violates DB NOT NULL constraint otherwise)
    const userEmail = (email && email.trim() !== "") ? email : `${phone}@customer.safeed.com`;

    // Check if user already exists with this email or phone (no double quotes in PostgREST .or() condition)
    const { data: existingUser } = await supabase
      .from("User")
      .select("*")
      .or(`email.eq.${userEmail},phone.eq.${phone}`)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: "এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।" };
    }

    // Insert user into Supabase Database
    const { data: user, error: insertError } = await supabase
      .from("User")
      .insert({
        id: crypto.randomUUID(),
        name,
        email: userEmail,
        phone,
        password, // In a real app, hash the password!
        address: address || "",
        role: Role.CUSTOMER
      })
      .select("*")
      .single();

    if (insertError || !user) {
      throw new Error(insertError?.message || "Failed to create user record.");
    }

    // Set a simple cookie session
    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, { httpOnly: true, secure: true });

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "রেজিস্ট্রেশন করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
  }
}

export async function login(formData: any) {
  try {
    const { identifier, password } = formData;
    const supabase = await createClient();

    // Query user matching credentials (no double quotes in PostgREST .or() condition)
    const { data: user } = await supabase
      .from("User")
      .select("*")
      .eq("password", password)
      .or(`email.eq.${identifier},phone.eq.${identifier}`)
      .maybeSingle();

    if (!user) {
      return { success: false, error: "ইমেইল/ফোন অথবা পাসওয়ার্ড ভুল।" };
    }

    const cookieStore = await cookies();
    cookieStore.set("user_id", user.id, { httpOnly: true, secure: true });

    return { success: true, user: { id: user.id, name: user.name, role: user.role } };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "লগইন করতে ব্যর্থ হয়েছে।" };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return null;

    const supabase = await createClient();
    const { data: user } = await supabase
      .from("User")
      .select("id, name, email, phone, role, address")
      .eq("id", userId)
      .maybeSingle();

    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("user_id");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

export async function updateUserProfile(name: string, address: string, phone?: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    if (!userId) return { success: false, error: "ইউজার সেশন পাওয়া যায়নি।" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("User")
      .update({
        name,
        address,
        ...(phone ? { phone } : {})
      })
      .eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    return { success: false, error: error.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।" };
  }
}
