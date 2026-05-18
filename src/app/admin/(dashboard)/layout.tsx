import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("User")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!user || (user.role !== 'ADMIN' && user.role !== 'CO_ADMIN' && user.role !== 'EDITOR')) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-hind">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col">
        <AdminHeader adminName={user.name || "Admin"} />
        
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
