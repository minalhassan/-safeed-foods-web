import React from "react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, Phone, CreditCard, Clock } from "lucide-react";
import StatusSelect from "../StatusSelect";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: order } = await supabase
    .from("Order")
    .select(`
      *,
      user:User(*),
      items:OrderItem(
        *,
        product:Product(*)
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-black">Order Not Found</h1>
        <Link href="/admin/orders" className="text-brand-primary mt-4 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-hind">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-white rounded-xl border border-brand-black/5 text-brand-black/50 hover:text-brand-primary transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-black font-noto">অর্ডার বিবরণ: #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-brand-black/50 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString('bn-BD')} at {new Date(order.createdAt).toLocaleTimeString('bn-BD')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-brand-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-brand-black/5 flex items-center justify-between">
              <h3 className="font-bold text-brand-black flex items-center gap-2">
                <Package className="text-brand-primary" size={20} />
                অর্ডার পণ্যসমূহ
              </h3>
              <span className="text-xs font-bold text-brand-black/40">{order.items ? order.items.length : 0}টি পণ্য</span>
            </div>
            <div className="divide-y divide-brand-black/5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-soft overflow-hidden shrink-0">
                    {/* Image placeholder */}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-black font-noto">{item.product?.name}</p>
                    <p className="text-xs text-brand-black/40 mt-1">দাম: ৳{item.price} × {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brand-black font-noto">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-brand-soft/30 space-y-4">
              <div className="flex justify-between text-brand-black/50 text-sm">
                <span>সাবটোটাল</span>
                <span className="font-noto">৳{order.total - 60}</span>
              </div>
              <div className="flex justify-between text-brand-black/50 text-sm">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-noto">৳৬০</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-brand-black border-t border-brand-black/5 pt-4">
                <span>সর্বমোট</span>
                <span className="text-brand-primary font-noto">৳{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-white rounded-3xl border border-brand-black/5 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-brand-black flex items-center gap-2">
              <Clock className="text-brand-primary" size={20} />
              অর্ডার স্ট্যাটাস
            </h3>
            <div className="pt-2">
              <StatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
            <p className="text-[10px] text-brand-black/40 leading-relaxed italic">
              * স্ট্যাটাস পরিবর্তন করলে গ্রাহক স্বয়ংক্রিয়ভাবে নোটিফিকেশন পেতে পারেন।
            </p>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-3xl border border-brand-black/5 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-brand-black flex items-center gap-2">
              <User className="text-brand-primary" size={20} />
              গ্রাহকের তথ্য
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-black/40 shrink-0">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">নাম</p>
                  <p className="text-sm font-bold text-brand-black">{order.user?.name || "Guest"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-black/40 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">ফোন নম্বর</p>
                  <p className="text-sm font-bold text-brand-black">{order.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-black/40 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">ডেলিভারি ঠিকানা</p>
                  <p className="text-sm font-medium text-brand-black leading-relaxed">{order.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center text-brand-black/40 shrink-0">
                  <CreditCard size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-brand-black/40 font-bold uppercase tracking-wider">পেমেন্ট মেথড</p>
                  <p className="text-sm font-bold text-brand-primary uppercase">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
