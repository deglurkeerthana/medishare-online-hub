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
