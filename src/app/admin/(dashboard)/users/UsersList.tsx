"use client";

import React, { useState } from "react";
import { Search, Users, Phone, MapPin, Calendar, Shield, Mail } from "lucide-react";

export default function UsersList({ initialUsers }: { initialUsers: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialUsers.filter((user) => {
    const term = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.address?.toLowerCase().includes(term)
    );
  });

  const adminsCount = initialUsers.filter(u => u.role === "ADMIN").length;
  const customersCount = initialUsers.filter(u => u.role === "CUSTOMER").length;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-brand-black/5 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-black">{initialUsers.length}</p>
            <p className="text-xs text-brand-black/40 font-bold uppercase tracking-wider">Total Registered</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-black/5 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-black">{adminsCount}</p>
            <p className="text-xs text-brand-black/40 font-bold uppercase tracking-wider">Administrators</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-brand-black/5 shadow-premium flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
            <Users size={24} className="scale-90" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-black">{customersCount}</p>
            <p className="text-xs text-brand-black/40 font-bold uppercase tracking-wider">Customers</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-3xl border border-brand-black/5 shadow-premium space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/30" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, phone, or address..."
            className="w-full pl-12 pr-6 py-4 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-2xl transition-all outline-none text-brand-black font-semibold text-sm"
          />
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-[2.5rem] border border-brand-black/5 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-soft/50 border-b border-brand-black/5 text-[11px] font-bold text-brand-black/40 uppercase tracking-widest font-hind">
                <th className="py-5 px-8">User Details</th>
                <th className="py-5 px-6">Phone Number</th>
                <th className="py-5 px-6">Role</th>
                <th className="py-5 px-8">Shipping Address</th>
                <th className="py-5 px-8 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5 font-hind text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-soft/20 transition-colors group">
                    <td className="py-5 px-8 flex items-center gap-3">
                      <div className="w-10 h-10 gradient-organic text-white rounded-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {user.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-brand-black">{user.name}</p>
                        <p className="text-xs text-brand-black/40 flex items-center gap-1">
                          <Mail size={12} className="text-brand-black/30" />
                          {user.email || "No Email"}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-6 font-semibold text-brand-black/75">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="text-brand-black/30" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "ADMIN" 
                          ? "bg-indigo-500/10 text-indigo-600" 
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-brand-black/60 font-medium">
                      <div className="flex items-start gap-2 max-w-[280px]">
                        <MapPin size={14} className="text-brand-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{user.address || "Address not provided"}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right text-brand-black/45 font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <Calendar size={14} className="text-brand-black/20" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-black/30 italic">
                    No users found matching your search.
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
