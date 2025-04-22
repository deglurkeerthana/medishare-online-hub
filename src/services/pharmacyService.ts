
import { pharmacies } from "./mockData";
import { Pharmacy } from "../types/pharmacy";

export const getPharmacies = () => {
  return Promise.resolve(pharmacies);
};

export const getPharmacyById = (id: string) => {
  const pharmacy = pharmacies.find(pharmacy => pharmacy.id === id);
  return Promise.resolve(pharmacy || null);
};

export const getPharmaciesByName = (name: string) => {
  const searchTerm = name.toLowerCase();
  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchTerm) || 
    pharmacy.city.toLowerCase().includes(searchTerm)
  );
  return Promise.resolve(filteredPharmacies);
};

export const getPharmacyByOwnerId = (ownerId: string) => {
  const pharmacy = pharmacies.find(pharmacy => pharmacy.ownerId === ownerId);
  return Promise.resolve(pharmacy || null);
};

export const addPharmacy = (pharmacy: Omit<Pharmacy, "id" | "rating" | "reviewCount">) => {
  const newPharmacy: Pharmacy = {
    ...pharmacy,
    id: `pharmacy-${Math.floor(Math.random() * 1000)}`,
    rating: 0,
    reviewCount: 0
  };
  
  pharmacies.push(newPharmacy);
  return Promise.resolve(newPharmacy);
};
