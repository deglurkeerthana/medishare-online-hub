
import { Medicine } from "../types/medicine";
import { Pharmacy } from "../types/pharmacy";
import { Order } from "../types/order";

// Mock Medicines Data
export const medicines: Medicine[] = [
  {
    id: "med-1",
    name: "Paracetamol",
    description: "Pain reliever and fever reducer used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.",
    price: 99,
    dosage: "500mg",
    sideEffects: ["Nausea", "Stomach pain", "Loss of appetite"],
    benefits: ["Reduces pain", "Lowers fever"],
    usage: "Take 1-2 tablets every 4-6 hours as needed, not to exceed 8 tablets in 24 hours.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 100,
    category: "Pain Relief",
    requires_prescription: false
  },
  {
    id: "med-2",
    name: "Amoxicillin",
    description: "Antibiotic used to treat a number of bacterial infections including middle ear infection, strep throat, pneumonia, skin infections, and urinary tract infections.",
    price: 299,
    dosage: "250mg",
    sideEffects: ["Diarrhea", "Rash", "Nausea", "Vomiting"],
    benefits: ["Treats bacterial infections", "Prevents bacterial growth"],
    usage: "Take one capsule by mouth three times daily with or without food.",
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 50,
    category: "Antibiotics",
    requires_prescription: true
  },
  {
    id: "med-3",
    name: "Ibuprofen",
    description: "Nonsteroidal anti-inflammatory drug used to reduce fever and treat pain or inflammation caused by many conditions such as headache, dental pain, menstrual cramps, and arthritis.",
    price: 149,
    dosage: "200mg",
    sideEffects: ["Upset stomach", "Mild heartburn", "Dizziness"],
    benefits: ["Reduces inflammation", "Relieves pain", "Lowers fever"],
    usage: "Take 1-2 tablets by mouth every 4-6 hours while symptoms persist. Do not exceed 6 tablets in 24 hours.",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 85,
    category: "Pain Relief",
    requires_prescription: false
  },
  {
    id: "med-4",
    name: "Lisinopril",
    description: "ACE inhibitor used to treat high blood pressure (hypertension) and heart failure. It can also improve survival after a heart attack.",
    price: 399,
    dosage: "10mg",
    sideEffects: ["Dizziness", "Cough", "Headache", "High potassium levels"],
    benefits: ["Lowers blood pressure", "Improves heart function"],
    usage: "Take one tablet by mouth once daily. May be taken with or without food.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 60,
    category: "Cardiovascular",
    requires_prescription: true
  },
  {
    id: "med-5",
    name: "Cetirizine",
    description: "Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.",
    price: 199,
    dosage: "10mg",
    sideEffects: ["Drowsiness", "Dry mouth", "Tiredness"],
    benefits: ["Relieves allergy symptoms", "Reduces itching"],
    usage: "Take one tablet by mouth once daily. May be taken with or without food.",
    imageUrl: "https://images.unsplash.com/photo-1558956397-7f6aea7aaab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 75,
    category: "Allergy Relief",
    requires_prescription: false
  },
  {
    id: "med-6",
    name: "Metformin",
    description: "Oral diabetes medicine that helps control blood sugar levels in people with type 2 diabetes.",
    price: 249,
    dosage: "500mg",
    sideEffects: ["Nausea", "Vomiting", "Stomach upset", "Diarrhea"],
    benefits: ["Controls blood sugar", "Improves insulin sensitivity"],
    usage: "Take one tablet by mouth twice daily with meals.",
    imageUrl: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    stock: 40,
    category: "Diabetes",
    requires_prescription: true
  }
];

// Mock Pharmacies Data
export const pharmacies: Pharmacy[] = [
  {
    id: "pharm-1",
    name: "HealthPlus Pharmacy",
    address: "123 Main Street, Cityville",
    city: "Cityville",
    state: "Maharashtra",
    zipCode: "400001",
    phone: "+91 9876543210",
    email: "info@healthplus.com",
    rating: 4.7,
    reviewCount: 120,
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "A trusted pharmacy providing quality healthcare products and services since 1995.",
    openingHours: "Mon-Sat: 8am-9pm, Sun: 10am-6pm",
    distance: "1.2 miles"
  },
  {
    id: "pharm-2",
    name: "MediCare Pharmacy",
    address: "456 Oak Avenue, Townsville",
    city: "Townsville",
    state: "Karnataka",
    zipCode: "560001",
    phone: "+91 9876543211",
    email: "contact@medicare.com",
    rating: 4.5,
    reviewCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Your neighborhood pharmacy offering personalized care and affordable medicines.",
    openingHours: "Mon-Fri: 9am-8pm, Sat-Sun: 10am-5pm",
    distance: "0.8 miles"
  },
  {
    id: "pharm-3",
    name: "QuickMeds Pharmacy",
    address: "789 Pine Road, Villagetown",
    city: "Villagetown",
    state: "Tamil Nadu",
    zipCode: "600001",
    phone: "+91 9876543212",
    email: "support@quickmeds.com",
    rating: 4.2,
    reviewCount: 75,
    imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Fast service pharmacy specializing in quick prescription fulfillment and delivery.",
    openingHours: "Mon-Sun: 7am-10pm",
    distance: "2.5 miles"
  },
  {
    id: "pharm-4",
    name: "Family Care Pharmacy",
    address: "321 Maple Drive, Hamletville",
    city: "Hamletville",
    state: "Delhi",
    zipCode: "110001",
    phone: "+91 9876543213",
    email: "care@familypharmacy.com",
    rating: 4.8,
    reviewCount: 150,
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Family-owned pharmacy providing compassionate care for all ages.",
    openingHours: "Mon-Sat: 8:30am-7:30pm, Sun: Closed",
    distance: "1.9 miles"
  }
];

// Mock Orders Data
export const orders: Order[] = [
  {
    id: "order-1",
    customerId: "user-1",
    pharmacyId: "pharm-1",
    pharmacyName: "HealthPlus Pharmacy",
    items: [
      {
        medicineId: "med-1",
        medicineName: "Paracetamol",
        quantity: 2,
        price: 5.99
      },
      {
        medicineId: "med-3",
        medicineName: "Ibuprofen",
        quantity: 1,
        price: 7.49
      }
    ],
    totalAmount: 19.47,
    status: "delivered",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-16T14:20:00Z",
    shippingAddress: "123 User Street, Usertown",
    paymentMethod: "Credit Card",
    trackingNumber: "MDS12345678"
  },
  {
    id: "order-2",
    customerId: "user-1",
    pharmacyId: "pharm-2",
    pharmacyName: "MediCare Pharmacy",
    items: [
      {
        medicineId: "med-5",
        medicineName: "Cetirizine",
        quantity: 1,
        price: 8.99
      }
    ],
    totalAmount: 8.99,
    status: "shipped",
    createdAt: "2023-04-18T15:45:00Z",
    updatedAt: "2023-04-19T09:30:00Z",
    shippingAddress: "123 User Street, Usertown",
    paymentMethod: "PayPal",
    trackingNumber: "MDS87654321"
  },
  {
    id: "order-3",
    customerId: "user-1",
    pharmacyId: "pharm-1",
    pharmacyName: "HealthPlus Pharmacy",
    items: [
      {
        medicineId: "med-2",
        medicineName: "Amoxicillin",
        quantity: 1,
        price: 12.99
      }
    ],
    totalAmount: 12.99,
    status: "processing",
    createdAt: "2023-04-20T11:20:00Z",
    updatedAt: "2023-04-20T12:15:00Z",
    shippingAddress: "123 User Street, Usertown",
    paymentMethod: "Cash on Delivery"
  }
];
