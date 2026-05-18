# Safeed Foods - Ultra-Modern Luxury Organic E-Commerce Platform

A premium, cinematic farm-to-home organic food e-commerce platform built with **Next.js 15 (App Router)**, **TypeScript**, **Framer Motion**, and a completely integrated secure backend powered by **Supabase PostgreSQL & Session Authentication**.

---

## 🌟 Key Features

### 1. 🛡️ Supabase SDK Architecture & Secure Auth
- **Session-Based Cookie Authentication**: Fully secure client-to-server request cycles using Supabase server clients (`createClient`) and middleware cookies.
- **Resilient Fallbacks**: Safe default states to guarantee 100% uptime with zero site crashes even if database caches are refreshing.

### 2. 👥 Multi-Role Role-Based Access Control (RBAC)
- Custom system permission tiers for administrator staff:
  - **`ADMIN` (Super Administrator)**: Full root-level control over Products, Orders, User Registries, Slide banner systems, Announcements, and Global Settings.
  - **`CO_ADMIN` (Co-Administrator)**: Access to Dashboard, Products, Customer Orders, Slides, and Announcements. (Settings and User Directory are automatically hidden).
  - **`EDITOR` (Editor)**: Access to Dashboard, Products, Slides, and Announcements. (Orders, Settings, and User Directory are automatically hidden).
- **Dynamic Sidebar Filters**: Re-renders sidebar items in real-time on active authentication mount.
- **Server Guards**: Layout page guards enforcing security checks server-side on all administrative routes.

### 3. 👥 Customer Shipping Profile & In-Line Editor
- Seamless profile icon and identity widget inside the storefront header navigation menu.
- In-line shipping address editor modal empowering customers to edit and save shipping coordinates directly from the navbar with instant PostgreSQL persistence.

### 4. 🗂️ Registered User Directory & Live Search
- Beautiful administration table view (`/admin/users`) displaying registered accounts.
- Shows Full Name, Email, Role badges (`ADMIN`, `CO_ADMIN`, `EDITOR`, `CUSTOMER`), Phone Number, Join Dates, and shipping address details.
- Real-time client-side search filtering to instantly search any customer index.

### 🖼️ 5. Dynamic Background Hero Slide Manager
- Home slider banners, images, H1 headlines, descriptive slogans, and Call-to-Action text buttons are fetched dynamically from the `HeroSlide` table.
- **Sleek Admin Slide Manager (`/admin/hero`)**:
  - Direct file upload from computer or mobile phone saving to `/api/upload` instantly.
  - Real-time mockup rendering panel simulating exactly how the slide looks on desktop/mobile as you edit!
  - Prominent unified bottom "Save Slide Changes" trigger.

### 📞 6. Dynamic Footer & Contact Coordinates
- Store details, physical address (`রাজশাহী, বাংলাদেশ`), contact emails, and office phone numbers are rendered dynamically in the Footer.
- Links directly to the **General Settings** panel database parameters.

### 💬 7. Dynamic WhatsApp Checkout & Float Button
- WhatsApp orders are fully dynamic and customizable.
- Enter your country-coded number in General Settings, and all:
  - Header Order buttons.
  - Mobile float order icons.
  - Product Card checkout drawers.
  - Product details purchase forms.
  ...will immediately route customer checkout chats to the new WhatsApp number!

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router), React 19 (Client & Server Components).
- **Styling & Theme**: Vanilla CSS custom variables, Tailwind CSS layout systems.
- **Animations**: Framer Motion.
- **Icons**: Lucide React.
- **Database & Authentication**: Supabase (PostgreSQL with Session Cookies).
- **Type Integrity**: 100% strict TypeScript (compiles with exactly exit code 0).

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Setup Database Schema
Login to your **[Supabase Console](https://supabase.com)**, open the **SQL Editor**, and run the database migration to create settings and slider elements:
```sql
-- Create StoreSettings Table
CREATE TABLE IF NOT EXISTS "StoreSetting" (
    "id" TEXT PRIMARY KEY,
    "storeName" TEXT NOT NULL DEFAULT 'Safeed Foods',
    "storeEmail" TEXT NOT NULL DEFAULT 'info@safeedfoods.com',
    "phone" TEXT NOT NULL DEFAULT '+৮৮০ ১৫৭০ ২৬২৮৬০',
    "address" TEXT NOT NULL DEFAULT 'রাজশাহী, বাংলাদেশ',
    "description" TEXT NOT NULL DEFAULT 'সরাসরি বাগান থেকে বাছাইকৃত কেমিক্যালমুক্ত ও স্বাস্থ্যসম্মত প্রিমিয়াম কোয়ালিটি ফল এবং অর্গানিক পণ্য আপনার দরজায় পৌঁছে দেয় সেফীড ফুডস।',
    "whatsapp" TEXT DEFAULT '8801570262860',
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "StoreSetting" DISABLE ROW LEVEL SECURITY;

-- Create HeroSlide Table
CREATE TABLE IF NOT EXISTS "HeroSlide" (
    "id" TEXT PRIMARY KEY,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "HeroSlide" DISABLE ROW LEVEL SECURITY;

-- Seed Default Settings and Slides
INSERT INTO "StoreSetting" ("id", "storeName", "storeEmail", "phone", "address", "description", "whatsapp")
VALUES (
    'store-default', 
    'Safeed Foods', 
    'info@safeedfoods.com', 
    '+৮৮০ ১৫৭০ ২৬২৮৬০', 
    'রাজশাহী, বাংলাদেশ', 
    'সরাসরি বাগান থেকে বাছাইকৃত কেমিক্যালমুক্ত ও স্বাস্থ্যসম্মত প্রিমিয়াম কোয়ালিটি ফল এবং অর্গানিক পণ্য আপনার দরজায় পৌঁছে দেয় সেফীড ফুডস।',
    '8801570262860'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "HeroSlide" ("id", "image", "title", "subtitle", "cta", "order")
VALUES 
('slide-1', '/hero-1.png', 'খাঁটি আম সরাসরি বাগান থেকে', 'কেমিক্যালমুক্ত, নিরাপদ ও প্রিমিয়াম মানের আম এখন আপনার ঘরে', 'এখনই অর্ডার করুন', 1),
('slide-2', '/hero-2.png', 'প্রাকৃতিক মধু ও অর্গানিক পণ্য', 'প্রকৃতির সেরা নির্যাস থেকে সংগৃহীত ১০০% বিশুদ্ধ ও নিরাপদ খাদ্য', 'পণ্যসমূহ দেখুন', 2),
('slide-3', '/hero-3.png', 'পরিবারের সুস্বাস্থ্যের নিশ্চয়তা', 'প্রিমিয়াম কোয়ালিটি পণ্য যা আপনার পরিবারের প্রতিটি সদস্যের জন্য নিরাপদ', 'আমাদের সম্পর্কে জানুন', 3)
ON CONFLICT ("id") DO NOTHING;
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Production Deployment

The project is configured for **Vercel** with full static fallbacks for instant edge deployment:

1. Push your repository to **GitHub**.
2. Connect your GitHub repository to **Vercel**.
3. Under **Project Settings -> Environment Variables**, add your three Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**!

---
Developed with ❤️ by **Md. Minal Hasan Raj Mim** for Safeed Foods.
