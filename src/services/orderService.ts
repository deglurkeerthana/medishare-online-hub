
import { mockOrders } from "./mockData";
import { Order } from "../types/order";

export const getAllOrders = () => {
  return Promise.resolve(mockOrders);
};

export const getOrderById = (id: string) => {
  const order = mockOrders.find(order => order.id === id);
  return Promise.resolve(order || null);
};

export const getOrdersByCustomer = (customerId: string) => {
  const filteredOrders = mockOrders.filter(order => order.customerId === customerId);
  return Promise.resolve(filteredOrders);
};

export const getOrdersByPharmacy = (pharmacyId: string) => {
  const filteredOrders = mockOrders.filter(order => order.pharmacyId === pharmacyId);
  return Promise.resolve(filteredOrders);
};

// Add the missing createOrder function
export const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
  const newOrder: Order = {
    ...orderData,
    id: `order-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockOrders.push(newOrder);
  return Promise.resolve(newOrder);
};

// Add the missing updateOrderStatus function
export const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return Promise.resolve(null);
  }

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  return Promise.resolve(mockOrders[orderIndex]);
};
