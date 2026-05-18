"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteOrder } from "@/lib/actions/order";
import { toast } from "react-hot-toast";

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteOrder(orderId);
    if (result.success) {
      toast.success("অর্ডার সফলভাবে মুছে ফেলা হয়েছে!");
    } else {
      toast.error(result.error || "অর্ডার মুছে ফেলা যায়নি।");
    }
    setIsDeleting(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
        >
          {isDeleting ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1.5 bg-brand-soft text-brand-black/60 text-[10px] font-bold rounded-lg hover:bg-brand-black/10 transition-all"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-brand-black/40 hover:text-red-500 transition-colors"
      title="Delete order"
    >
      <Trash2 size={18} />
    </button>
  );
}
