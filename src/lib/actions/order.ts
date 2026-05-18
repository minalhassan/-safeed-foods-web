"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Role, OrderStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: any, items: any[], totalPrice: number) {
  let createdOrderId: string | null = null;
  
  try {
    console.log("Creating order with data:", { formData, items, totalPrice });

    const { name, phone, address, paymentMethod, bkashTrxId } = formData;
    const supabase = await createClient();

    // 1. Create or find user by phone
    let { data: user } = await supabase
      .from("User")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (!user) {
      console.log("User not found, creating new user for phone:", phone);
      const { data: newUser, error: userError } = await supabase
        .from("User")
        .insert({
          id: crypto.randomUUID(),
          name,
          email: `${phone}@customer.safeed.com`, // auto-generated from phone
          phone,
          address,
          role: Role.CUSTOMER
        })
        .select("*")
        .single();

      if (userError || !newUser) {
        throw new Error(userError?.message || "Failed to create customer user record.");
      }
      user = newUser;
    }

    console.log("Using user:", user.id);

    // 2. Create the Order in Supabase
    const orderId = crypto.randomUUID();
    const { data: order, error: orderError } = await supabase
      .from("Order")
      .insert({
        id: orderId,
        userId: user.id,
        total: Number(totalPrice),
        status: OrderStatus.PENDING,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "bkash" ? "paid" : "unpaid",
        bkashTrxId: bkashTrxId || null,
        address: address,
        phone: phone,
        isWhatsAppOrder: false
      })
      .select("*")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || "Failed to create order record.");
    }

    createdOrderId = order.id;

    // 3. Create the OrderItems in Supabase
    const orderItems = items.map((item: any) => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      productId: item.id,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    const { error: itemsError } = await supabase
      .from("OrderItem")
      .insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message || "Failed to create order items.");
    }

    console.log("Order created successfully in Supabase PostgreSQL:", order.id);

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to create order. Detailed error:", error);
    
    // ROLLBACK: If parent order was created but items failed, delete the parent order record
    if (createdOrderId) {
      try {
        const supabase = await createClient();
        await supabase.from("Order").delete().eq("id", createdOrderId);
        console.log("🧹 Successfully rolled back orphan order ID:", createdOrderId);
      } catch (rollbackError) {
        console.error("Failed to rollback orphan order:", rollbackError);
      }
    }

    return { 
      success: false, 
      error: "অর্ডার তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে কার্ট খালি করে নতুন আম যোগ করুন এবং আবার চেষ্টা করুন।" 
    };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const supabase = await createClient();

    // 1. Update in Supabase
    const { error: updateError } = await supabase
      .from("Order")
      .update({ status })
      .eq("id", orderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const supabase = await createClient();

    // 1. Delete order items first (foreign key constraint) in Supabase
    const { error: itemsDeleteError } = await supabase
      .from("OrderItem")
      .delete()
      .eq("orderId", orderId);

    if (itemsDeleteError) {
      throw new Error(itemsDeleteError.message);
    }

    // Then delete the order in Supabase
    const { error: orderDeleteError } = await supabase
      .from("Order")
      .delete()
      .eq("id", orderId);

    if (orderDeleteError) {
      throw new Error(orderDeleteError.message);
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "অর্ডার মুছে ফেলা যায়নি।" };
  }
}
