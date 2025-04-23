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
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae",
    usage: "Take as directed by your healthcare provider",
    benefits: ["Reduces fever", "Relieves pain", "Safe for most people"],
    sideEffects: ["Nausea", "Liver damage in high doses"],
    pharmacyId: "1",
    ownerId: "pharmacist1",
    manufactureDate: "2024-01-01",
    expiryDate: "2026-01-01"
  },
  {
    id: "2",
    name: "Metformin",
    description: "Medication for type 2 diabetes",
    price: 299,
    dosage: "500mg",
    category: "Diabetes",
    stock: 50,
    requires_prescription: true,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843",
    usage: "Take with meals as prescribed",
    benefits: ["Controls blood sugar", "Improves insulin sensitivity"],
    sideEffects: ["Nausea", "Diarrhea", "Loss of appetite"],
    pharmacyId: "1",
    ownerId: "pharmacist1",
    manufactureDate: "2024-02-01",
    expiryDate: "2026-02-01"
  }
];

export const mockPharmacies: Pharmacy[] = [
  {
    id: "pharmacy-1",
    name: "HealthCare Plus",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    phone: "+91-9876543210",
    email: "info@healthcareplus.com",
    description: "Your trusted neighborhood pharmacy",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 2,
    openingHours: "9:00 AM - 9:00 PM",
    distance: "0.5 km",
    reviews: [
      {
        id: "review-1",
        userId: "user-1",
        userName: "John Doe",
        rating: 5,
        comment: "Great service and friendly staff!",
        createdAt: "2025-04-20T10:00:00Z"
      },
      {
        id: "review-2",
        userId: "user-2",
        userName: "Jane Smith",
        rating: 4,
        comment: "Good medicine selection",
        createdAt: "2025-04-19T15:30:00Z"
      }
    ]
  },
  {
    id: "1",
    name: "Family Care Pharmacy",
    address: "123 Main St, City Center",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    phone: "+91 1234567890",
    email: "contact@familycare.com",
    description: "Your trusted family pharmacy",
    rating: 4.5,
    reviewCount: 128,
    openingHours: "9:00 AM - 9:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
    ownerId: "pharmacist1"
  },
  {
    id: "2",
    name: "Health First Pharmacy",
    address: "456 Park Ave, Downtown",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110001",
    phone: "+91 9876543210",
    email: "contact@healthfirst.com",
    description: "Professional pharmacy services with a personal touch",
    rating: 4.8,
    reviewCount: 256,
    openingHours: "8:00 AM - 10:00 PM",
    imageUrl: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb",
    ownerId: "pharmacist2"
  }
];

export const mockOrders: Order[] = [
  {
    id: "1",
    customerId: "customer1",
    pharmacyId: "1",
    items: [
      { 
        medicineId: "1", 
        quantity: 2,
        medicineName: "Paracetamol",
        price: 149
      },
      { 
        medicineId: "2", 
        quantity: 1,
        medicineName: "Metformin",
        price: 299
      }
    ],
    totalAmount: 597,
    orderDate: new Date(),
    status: "pending",
  },
  {
    id: "2",
    customerId: "customer2",
    pharmacyId: "2",
    items: [
      { 
        medicineId: "1", 
        quantity: 3,
        medicineName: "Paracetamol",
        price: 149
      }
    ],
    totalAmount: 447,
    orderDate: new Date(),
    status: "shipped",
  },
];
