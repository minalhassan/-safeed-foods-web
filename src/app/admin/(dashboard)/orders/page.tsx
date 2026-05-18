import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { Search, Filter, Eye } from "lucide-react";
import StatusSelect from "./StatusSelect";
import DeleteOrderButton from "./DeleteOrderButton";
import Link from "next/link";

export default async function AdminOrdersPage() {
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

  // Permitted roles for Order management: ADMIN and CO_ADMIN
  if (!activeUser || (activeUser.role !== "ADMIN" && activeUser.role !== "CO_ADMIN")) {
    redirect("/admin");
  }

  const { data: ordersData } = await supabase
    .from("Order")
    .select(`
      *,
      user:User(*),
      items:OrderItem(
        *,
        product:Product(*)
      )
    `)
    .order("createdAt", { ascending: false });

  const orders = ordersData || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black">Order Management</h1>
          <p className="text-brand-black/50 text-sm">Manage and track all customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/30" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-white border border-brand-black/10 rounded-xl text-sm outline-none focus:border-brand-primary transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-brand-black/10 rounded-xl text-brand-black/60 hover:text-brand-primary transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-brand-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-soft/50 border-b border-brand-black/5">
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Order Info</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5">
              {orders.length > 0 ? orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-brand-soft/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-black">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-[10px] text-brand-black/40 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD')} | {new Date(order.createdAt).toLocaleTimeString('bn-BD')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-black">{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-brand-black/40 mt-0.5">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-brand-black/60">{order.items ? order.items.length : 0} items</p>
                    <div className="flex -space-x-2 mt-2">
                      {order.items?.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="w-6 h-6 rounded-full bg-brand-soft border-2 border-white overflow-hidden">
                           {/* image placeholder */}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-brand-primary font-noto">৳{order.total.toLocaleString()}</p>
                    <p className="text-[10px] text-brand-black/40 mt-1 capitalize">{order.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/orders/${order.id}`} className="p-2 text-brand-black/40 hover:text-brand-primary transition-colors">
                        <Eye size={18} />
                      </Link>
                      <DeleteOrderButton orderId={order.id} />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-brand-black/30">
                    এখনও কোন অর্ডার নেই
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
