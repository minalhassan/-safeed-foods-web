import React from "react";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real data from Supabase
  const { count: totalOrdersCount } = await supabase
    .from("Order")
    .select("*", { count: "exact", head: true });

  const { data: revenueData } = await supabase
    .from("Order")
    .select("total");

  const sumTotal = revenueData?.reduce((acc, row) => acc + (row.total || 0), 0) || 0;
  const totalRevenue = { _sum: { total: sumTotal } };

  const { count: totalUsersCount } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .eq("role", "CUSTOMER");

  const totalUsers = totalUsersCount || 0;

  const { data: recentOrdersData } = await supabase
    .from("Order")
    .select("*, user:User(*)")
    .order("createdAt", { ascending: false })
    .limit(5);

  const recentOrders = recentOrdersData || [];

  const stats = [
    { 
      name: "Total Revenue", 
      value: `৳${(totalRevenue._sum.total || 0).toLocaleString()}`, 
      icon: DollarSign, 
      trend: "+১২.৫%", 
      isUp: true 
    },
    { 
      name: "Total Orders", 
      value: (totalOrdersCount || 0).toLocaleString(), 
      icon: Package, 
      trend: "+৮.২%", 
      isUp: true 
    },
    { 
      name: "New Customers", 
      value: totalUsers.toLocaleString(), 
      icon: Users, 
      trend: "+৫.১%", 
      isUp: true 
    },
    { 
      name: "Conversion Rate", 
      value: "৩.৫%", 
      icon: TrendingUp, 
      trend: "-১.২%", 
      isUp: false 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Dashboard Overview</h1>
        <p className="text-brand-black/50 text-sm">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-2xl border border-brand-black/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center text-brand-primary">
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                stat.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              )}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-brand-black/50 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-brand-black mt-1 font-noto">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-black/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-black/5 flex items-center justify-between">
            <h3 className="font-bold text-brand-black">Recent Orders</h3>
            <Link href="/admin/orders" className="text-brand-primary text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-soft/50">
                  <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-brand-black/40 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/5">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-soft/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-brand-black">#{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-brand-black/60">{order.user?.name || "Guest"}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'DELIVERED' ? "bg-green-50 text-green-600" : 
                        order.status === 'PENDING' ? "bg-yellow-50 text-yellow-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-black font-noto">৳{order.total.toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-brand-black/30">কোন অর্ডার পাওয়া যায়নি</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-brand-black/5 shadow-sm p-6">
          <h3 className="font-bold text-brand-black mb-6">Top Products</h3>
          <div className="space-y-6">
            {[
              { name: "Gopalbhog Mango", sales: "৪৫০ কেজি", price: "৳২৮০" },
              { name: "Organic Honey", sales: "১২০ টি", price: "৳১২০০" },
              { name: "Premium Ghee", sales: "৮০ টি", price: "৳১৫০০" },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-soft shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-black leading-none mb-1">{product.name}</p>
                  <p className="text-xs text-brand-black/40">{product.sales} বিক্রীত</p>
                </div>
                <p className="text-sm font-bold text-brand-primary">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
