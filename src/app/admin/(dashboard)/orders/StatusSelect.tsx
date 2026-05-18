"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { updateOrderStatus } from "@/lib/actions/order";
import { toast } from "react-hot-toast";

interface StatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export default function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsLoading(true);
    
    const result = await updateOrderStatus(orderId, newStatus as any);
    
    if (result.success) {
      setStatus(newStatus);
      toast.success("অর্ডার স্ট্যাটাস আপডেট করা হয়েছে!");
    } else {
      toast.error("আপডেট করতে সমস্যা হয়েছে।");
    }
    setIsLoading(false);
  };

  return (
    <select 
      value={status}
      onChange={handleStatusChange}
      disabled={isLoading}
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-none outline-none appearance-none cursor-pointer disabled:opacity-50 transition-colors",
        status === 'DELIVERED' ? "bg-green-50 text-green-600" : 
        status === 'PENDING' ? "bg-yellow-50 text-yellow-600" : 
        status === 'CANCELLED' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
      )}
    >
      <option value="PENDING">Pending</option>
      <option value="PROCESSING">Processing</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  );
}
