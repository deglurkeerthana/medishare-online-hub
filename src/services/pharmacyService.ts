
import { pharmacies } from "./mockData";

export const getAllPharmacies = () => {
  return Promise.resolve(pharmacies);
};

export const getPharmacyById = (id: string) => {
  const pharmacy = pharmacies.find(pharm => pharm.id === id);
  return Promise.resolve(pharmacy || null);
};

export const searchPharmacies = (query: string) => {
  const searchTerm = query.toLowerCase();
  const filteredPharmacies = pharmacies.filter(
    pharm => 
      pharm.name.toLowerCase().includes(searchTerm) || 
      pharm.address.toLowerCase().includes(searchTerm) ||
      pharm.description.toLowerCase().includes(searchTerm)
  );
  return Promise.resolve(filteredPharmacies);
};
