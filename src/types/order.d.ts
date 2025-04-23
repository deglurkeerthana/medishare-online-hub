
export interface Order {
  id: string;
  userId: string;
  pharmacyId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

