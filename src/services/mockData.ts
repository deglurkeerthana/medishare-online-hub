import { Medicine } from "../types/medicine";
import { Pharmacy } from "../types/pharmacy";
import { Order } from "../types/order";

export const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    price: 149,
    dosage: "500mg",
    category: "Pain Relief",
    stock: 100,
    requires_prescription: false,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    usage: "Take as directed by your healthcare provider",
    benefits: ["Reduces fever", "Relieves pain", "Safe for most people"],
    sideEffects: ["Nausea", "Liver damage in high doses"],
    pharmacyId: "1",
    ownerId: "pharmacist1"
  },
  {
    id: "2",
    name: "Amoxicillin",
    description: "Antibiotic for bacterial infections",
    price: 299,
    dosage: "250mg",
    category: "Antibiotics",
    stock: 50,
    requires_prescription: true,
    imageUrl: "https://images.unsplash.com/photo-1487252665478-49b61b47f302",
    usage: "Complete full course as prescribed",
    benefits: ["Treats bacterial infections", "Broad spectrum antibiotic"],
    sideEffects: ["Diarrhea", "Rash", "Nausea"],
    pharmacyId: "1",
    ownerId: "pharmacist1"
  }
];

export const mockPharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "City Pharmacy",
    address: "123 Main St, City Center",
    description: "Your neighborhood pharmacy for all medical needs",
    rating: 4.5,
    openingHours: "9:00 AM - 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    ownerId: "pharmacist1"
  },
  {
    id: "2",
    name: "Health First Pharmacy",
    address: "456 Park Ave, Downtown",
    description: "Professional pharmacy services with a personal touch",
    rating: 4.8,
    openingHours: "8:00 AM - 10:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    ownerId: "pharmacist2"
  }
];

export const mockOrders: Order[] = [
  {
    id: "1",
    customerId: "customer1",
    pharmacyId: "1",
    items: [
      { medicineId: "1", quantity: 2 },
      { medicineId: "2", quantity: 1 },
    ],
    totalAmount: 597,
    orderDate: new Date(),
    status: "Pending",
  },
  {
    id: "2",
    customerId: "customer2",
    pharmacyId: "2",
    items: [{ medicineId: "1", quantity: 3 }],
    totalAmount: 447,
    orderDate: new Date(),
    status: "Shipped",
  },
];
