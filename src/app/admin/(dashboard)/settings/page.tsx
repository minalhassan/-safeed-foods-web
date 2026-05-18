"use client";

import React, { useState, useEffect } from "react";
import { Save, User, Lock, Bell, Globe, Phone, Mail, MapPin, Shield, Edit3, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { changeAdminPassword } from "@/lib/actions/admin";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/auth";
import { getStoreSettings, updateStoreSettings } from "@/lib/actions/settings";

export default function AdminSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);

  // General tab state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Safeed Foods",
    storeEmail: "hello@safeedfoods.com",
    phone: "+880 15702 62860",
    address: "Dhaka, Bangladesh",
    description: "Premium Organic Foods straight from our orchards to your doorstep.",
    whatsapp: "8801570262860"
  });

  // Profile tab state
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminAddress, setAdminAddress] = useState("");

  // Security tab state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newOrders: true,
    stockAlerts: false,
    newsletter: true
  });

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch active administrator profile details and verify role
        const activeAdmin = await getCurrentUser();
        if (!activeAdmin) {
          router.push("/admin/login");
          return;
        }

        // Only ADMINs are allowed in System Settings
        if (activeAdmin.role !== 'ADMIN') {
          toast.error("আপনার এই সেটিংস পেজে ঢোকার অনুমতি নেই!");
          router.push("/admin");
          return;
        }

        setAdminName(activeAdmin.name || "Admin");
        setAdminEmail(activeAdmin.email || "");
        setAdminPhone(activeAdmin.phone || "");
        setAdminAddress(activeAdmin.address || "");

        // Fetch store settings
        const store = await getStoreSettings();
        setStoreSettings({
          storeName: store.storeName,
          storeEmail: store.storeEmail,
          phone: store.phone,
          address: store.address,
          description: store.description,
          whatsapp: store.whatsapp
        });
      } catch (error) {
        console.error("Failed to load settings data:", error);
      }
      setIsLoading(false);
    }
    loadData();
  }, [router]);

  const handleSave = async () => {
    setIsLoading(true);

    if (activeTab === "general") {
      const result = await updateStoreSettings(storeSettings);
      if (result.success) {
        toast.success("স্টোর সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!");
      } else {
        toast.error(result.error || "স্টোর সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।");
      }
    } 
    
    else if (activeTab === "profile") {
      if (!adminName.trim()) {
        toast.error("নাম খালি রাখা যাবে না।");
        setIsLoading(false);
        return;
      }
      const result = await updateUserProfile(adminName, adminAddress, adminPhone);
      if (result.success) {
        toast.success("অ্যাডমিন প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      } else {
        toast.error(result.error || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।");
      }
    } 
    
    else if (activeTab === "security") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("অনুগ্রহ করে সকল পাসওয়ার্ড ফিল্ড পূরণ করুন।");
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("নতুন পাসওয়ার্ড দুটি মেলেনি।");
        setIsLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        toast.error("পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।");
        setIsLoading(false);
        return;
      }

      const result = await changeAdminPassword(currentPassword, newPassword);
      if (result.success) {
        toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।");
      }
    } 
    
    else if (activeTab === "notifications") {
      // Just simulate for notifications
      setTimeout(() => {
        toast.success("নোটিফিকেশন প্রেফারেন্স আপডেট করা হয়েছে!");
      }, 500);
    }

    setIsLoading(false);
  };

  const tabs = [
    { id: "general", name: "General Settings", icon: Globe, desc: "Manage storefront identity, contact numbers and locations." },
    { id: "profile", name: "Admin Profile", icon: User, desc: "Edit your administrator identity and shipping coordinates." },
    { id: "security", name: "Security & Login", icon: Lock, desc: "Modify authorization credentials and login credentials." },
    { id: "notifications", name: "Notifications", icon: Bell, desc: "Configure order alert systems and stock warnings." },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-brand-black/5 pb-6">
        <h1 className="text-3xl font-black text-brand-black font-noto tracking-tight">System Settings</h1>
        <p className="text-brand-black/50 text-sm mt-1">Configure global store preferences, administrator profile, and system parameters.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-brand-black/5 shadow-premium overflow-hidden flex flex-col md:flex-row min-h-[620px]">
        {/* Tab Sidebar */}
        <div className="w-full md:w-80 bg-brand-soft/20 border-r border-brand-black/5 p-6 md:p-8 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 ${
                activeTab === tab.id 
                  ? "bg-white text-brand-primary shadow-premium border border-brand-primary/5 translate-x-2" 
                  : "text-brand-black/45 hover:bg-white/50 hover:text-brand-primary hover:translate-x-1"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                activeTab === tab.id ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-black/5 text-brand-black/40"
              }`}>
                <tab.icon size={18} />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-sm">{tab.name}</p>
                <p className="text-[10px] leading-tight text-brand-black/40 font-medium line-clamp-2">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
          <div className="space-y-8 flex-1">
            {activeTab === "general" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-brand-black/5 pb-4">
                  <Globe className="text-brand-primary" size={22} />
                  <h3 className="font-bold text-lg text-brand-black font-noto">Store Identity Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Store Name</label>
                    <input 
                      type="text" 
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Store Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input 
                        type="email" 
                        value={storeSettings.storeEmail}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Contact Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input 
                        type="tel" 
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Office Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input 
                        type="text" 
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                  </div>

                  {/* WhatsApp Order Field */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">WhatsApp Ordering Number (Direct Checkout Link)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={16} />
                      <input 
                        type="text" 
                        value={storeSettings.whatsapp}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="e.g. 8801570262860 (no spaces or plus signs)"
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                    <p className="text-[10px] text-brand-black/40 font-medium ml-1">
                      Note: Format should be country code first without spaces or '+' (e.g. `8801570262860`). This will dynamically update all WhatsApp Checkout and Customer Order buttons!
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-black/60 ml-1">Store Slogan / Description</label>
                  <textarea 
                    rows={4} 
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black resize-none leading-relaxed" 
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-brand-black/5 pb-4">
                  <User className="text-brand-primary" size={22} />
                  <h3 className="font-bold text-lg text-brand-black font-noto">Admin Profile Settings</h3>
                </div>

                <div className="flex items-center gap-6 p-6 bg-brand-soft/30 rounded-3xl border border-brand-black/5">
                  <div className="w-20 h-20 rounded-2xl gradient-organic flex items-center justify-center text-white text-3xl font-bold shadow-premium shrink-0">
                    {adminName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-black leading-tight">{adminName}</h4>
                    <p className="text-xs text-brand-black/40 font-bold mt-1 uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-md inline-block">
                      Super Administrator
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Admin Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input 
                        type="text" 
                        value={adminName} 
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Registered Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/20" size={16} />
                      <input 
                        type="text" 
                        value={adminPhone} 
                        onChange={(e) => setAdminPhone(e.target.value)}
                        className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-black/60 ml-1">Admin Contact Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-brand-black/25" size={16} />
                    <textarea 
                      rows={3}
                      value={adminAddress} 
                      onChange={(e) => setAdminAddress(e.target.value)}
                      className="w-full pl-11 pr-5 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black resize-none" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-brand-black/5 pb-4">
                  <Lock className="text-red-500" size={22} />
                  <h3 className="font-bold text-lg text-brand-black font-noto">Change Admin Credentials</h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input
                        type={showPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Verify existing credentials..."
                        className="w-full pl-11 pr-12 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/30 hover:text-brand-primary transition-colors focus:outline-none"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">New Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input
                        type={showPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters recommended..."
                        className="w-full pl-11 pr-12 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-black/60 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/25" size={16} />
                      <input
                        type={showPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Retype password..."
                        className="w-full pl-11 pr-12 py-3.5 bg-brand-soft border-2 border-transparent focus:border-brand-primary focus:bg-white rounded-xl transition-all outline-none font-semibold text-sm text-brand-black"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex items-center gap-3 border-b border-brand-black/5 pb-4">
                  <Bell className="text-brand-primary" size={22} />
                  <h3 className="font-bold text-lg text-brand-black font-noto">Alert & Notification Toggles</h3>
                </div>

                {[
                  { key: "emailAlerts", label: "SMTP Email Notifications", desc: "Send automated dispatch alerts and invoice receipts via server mailer." },
                  { key: "newOrders", label: "Realtime New Order Alerts", desc: "Trigger sound updates and push reports on order arrival." },
                  { key: "stockAlerts", label: "Low Inventory Stock Warnings", desc: "Flag alerts when mango products or specific items drop below 50KG." },
                  { key: "newsletter", label: "Weekly Newsletter Digests", desc: "Receive analytics reports on new customer subscriptions." },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-5 bg-brand-soft/20 rounded-2xl border border-brand-black/5">
                    <div className="pr-4">
                      <p className="font-bold text-brand-black text-sm">{item.label}</p>
                      <p className="text-[11px] text-brand-black/40 font-medium leading-normal mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({
                        ...prev,
                        [item.key]: !prev[item.key as keyof typeof prev]
                      }))}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 shrink-0 ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-brand-primary' : 'bg-brand-black/20'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                        notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Persistent Action Save Button placed at the very bottom of active tab form fields */}
          <div className="mt-12 pt-6 border-t border-brand-black/5 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full md:w-auto px-8 py-4 gradient-organic text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium hover:shadow-[0_20px_40px_-10px_rgba(46,125,50,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50 font-hind text-[15px]"
            >
              <Save size={18} />
              {isLoading ? "Saving changes..." : activeTab === "security" ? "Change Password" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
