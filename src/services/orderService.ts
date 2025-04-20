
import { orders } from "./mockData";
import { Order, OrderStatus } from "../types/order";

export const getOrdersByCustomer = (customerId: string) => {
  const customerOrders = orders.filter(order => order.customerId === customerId);
  return Promise.resolve(customerOrders);
};

export const getOrdersByPharmacy = (pharmacyId: string) => {
  const pharmacyOrders = orders.filter(order => order.pharmacyId === pharmacyId);
  return Promise.resolve(pharmacyOrders);
};

export const getOrderById = (id: string) => {
  const order = orders.find(order => order.id === id);
  return Promise.resolve(order || null);
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  // In a real app, this would make an API call
  // For the demo, we'll just return the updated order
  const updatedOrder = orders.find(order => order.id === id);
  
  if (updatedOrder) {
    updatedOrder.status = status;
    updatedOrder.updatedAt = new Date().toISOString();
  }
  
  return Promise.resolve(updatedOrder || null);
};

export const createOrder = (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
  // In a real app, this would make an API call
  // For the demo, we'll create a new order with a random ID
  const now = new Date().toISOString();
  const newOrder: Order = {
    ...order,
    id: `order-${Math.floor(Math.random() * 1000)}`,
    createdAt: now,
    updatedAt: now
  };
  
  // We would add this to our database
  return Promise.resolve(newOrder);
};
