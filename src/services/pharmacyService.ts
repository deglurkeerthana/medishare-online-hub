import { mockPharmacies } from "./mockData";
import { Pharmacy, PharmacyReview } from "../types/pharmacy";

export const getPharmacies = () => {
  return Promise.resolve(mockPharmacies);
};

// Alias for getPharmacies to maintain backward compatibility if needed
export const getAllPharmacies = getPharmacies;

export const getPharmacyById = (id: string) => {
  const pharmacy = mockPharmacies.find(pharmacy => pharmacy.id === id);
  return Promise.resolve(pharmacy || null);
};

export const getPharmaciesByName = (name: string) => {
  const searchTerm = name.toLowerCase();
  const filteredPharmacies = mockPharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchTerm) || 
    pharmacy.city.toLowerCase().includes(searchTerm)
  );
  return Promise.resolve(filteredPharmacies);
};

export const getPharmacyByOwnerId = (ownerId: string) => {
  const pharmacy = mockPharmacies.find(pharmacy => pharmacy.ownerId === ownerId);
  return Promise.resolve(pharmacy || null);
};

export const addPharmacy = (pharmacy: Omit<Pharmacy, "id" | "rating" | "reviewCount">) => {
  const newPharmacy: Pharmacy = {
    ...pharmacy,
    id: `pharmacy-${Math.floor(Math.random() * 1000)}`,
    rating: 0,
    reviewCount: 0
  };
  
  mockPharmacies.push(newPharmacy);
  return Promise.resolve(newPharmacy);
};

export const addPharmacyReview = (pharmacyId: string, review: Omit<PharmacyReview, "id" | "createdAt">) => {
  const pharmacy = mockPharmacies.find(p => p.id === pharmacyId);
  if (!pharmacy) return Promise.resolve(null);

  const newReview = {
    ...review,
    id: `review-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };

  if (!pharmacy.reviews) {
    pharmacy.reviews = [];
  }
  pharmacy.reviews.push(newReview);

  // Update pharmacy rating
  const totalRating = pharmacy.reviews.reduce((sum, r) => sum + r.rating, 0);
  pharmacy.rating = totalRating / pharmacy.reviews.length;
  pharmacy.reviewCount = pharmacy.reviews.length;

  return Promise.resolve(pharmacy);
};

export const updatePharmacyImage = (pharmacyId: string, imageUrl: string) => {
  const pharmacyIndex = mockPharmacies.findIndex(p => p.id === pharmacyId);
  if (pharmacyIndex === -1) return Promise.resolve(null);

  mockPharmacies[pharmacyIndex] = {
    ...mockPharmacies[pharmacyIndex],
    imageUrl
  };

  return Promise.resolve(mockPharmacies[pharmacyIndex]);
};

export const updatePharmacyOwnerImage = (pharmacyId: string, ownerImage: string) => {
  const pharmacyIndex = mockPharmacies.findIndex(p => p.id === pharmacyId);
  if (pharmacyIndex === -1) return Promise.resolve(null);

  mockPharmacies[pharmacyIndex] = {
    ...mockPharmacies[pharmacyIndex],
    ownerImage
  };

  return Promise.resolve(mockPharmacies[pharmacyIndex]);
};
