export enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  CO_ADMIN = "CO_ADMIN",
  EDITOR = "EDITOR",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  password?: string | null;
  image?: string | null;
  role: Role;
  phone?: string | null;
  address?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image?: string | null;
  stock: number;
  isFeatured: boolean;
  categoryId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethod?: string | null;
  bkashTrxId?: string | null;
  isWhatsAppOrder: boolean;
  address: string;
  phone: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
