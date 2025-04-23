import { mockMedicines } from "./mockData";
import { Medicine } from "../types/medicine";

export const getAllMedicines = (ownerId?: string) => {
  if (ownerId) {
    const filteredMedicines = mockMedicines.filter(med => med.ownerId === ownerId);
    return Promise.resolve(filteredMedicines);
  }
  return Promise.resolve(mockMedicines);
};

export const getMedicineById = (id: string) => {
  const medicine = mockMedicines.find(med => med.id === id);
  return Promise.resolve(medicine || null);
};

export const getMedicinesByCategory = (category: string) => {
  const filteredMedicines = mockMedicines.filter(med => med.category === category);
  return Promise.resolve(filteredMedicines);
};

export const getMedicinesByPharmacy = (pharmacyId: string) => {
  const filteredMedicines = mockMedicines.filter(med => med.pharmacyId === pharmacyId);
  return Promise.resolve(filteredMedicines);
};

export const searchMedicines = (query: string) => {
  const searchTerm = query.toLowerCase();
  const filteredMedicines = mockMedicines.filter(
    med => 
      med.name.toLowerCase().includes(searchTerm) || 
      med.description.toLowerCase().includes(searchTerm) ||
      med.category.toLowerCase().includes(searchTerm)
  );
  return Promise.resolve(filteredMedicines);
};

export const updateMedicineStock = (id: string, newStock: number) => {
  const updatedMedicines = mockMedicines.map(med => 
    med.id === id ? { ...med, stock: newStock } : med
  );
  
  return Promise.resolve(updatedMedicines.find(med => med.id === id) || null);
};

export const addMedicine = (medicine: Omit<Medicine, "id">) => {
  const newMedicine: Medicine = {
    ...medicine,
    id: `med-${Math.floor(Math.random() * 1000)}`
  };
  
  mockMedicines.push(newMedicine);
  return Promise.resolve(newMedicine);
};

export const deleteMedicine = (id: string) => {
  const index = mockMedicines.findIndex(med => med.id === id);
  if (index !== -1) {
    mockMedicines.splice(index, 1);
  }
  
  return Promise.resolve(true);
};
