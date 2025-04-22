
import { medicines } from "./mockData";
import { Medicine } from "../types/medicine";

export const getAllMedicines = (ownerId?: string) => {
  if (ownerId) {
    const filteredMedicines = medicines.filter(med => med.ownerId === ownerId);
    return Promise.resolve(filteredMedicines);
  }
  return Promise.resolve(medicines);
};

export const getMedicineById = (id: string) => {
  const medicine = medicines.find(med => med.id === id);
  return Promise.resolve(medicine || null);
};

export const getMedicinesByCategory = (category: string) => {
  const filteredMedicines = medicines.filter(med => med.category === category);
  return Promise.resolve(filteredMedicines);
};

export const getMedicinesByPharmacy = (pharmacyId: string) => {
  const filteredMedicines = medicines.filter(med => med.pharmacyId === pharmacyId);
  return Promise.resolve(filteredMedicines);
};

export const searchMedicines = (query: string) => {
  const searchTerm = query.toLowerCase();
  const filteredMedicines = medicines.filter(
    med => 
      med.name.toLowerCase().includes(searchTerm) || 
      med.description.toLowerCase().includes(searchTerm) ||
      med.category.toLowerCase().includes(searchTerm)
  );
  return Promise.resolve(filteredMedicines);
};

export const updateMedicineStock = (id: string, newStock: number) => {
  // In a real app, this would make an API call
  // For the demo, we'll just return the updated medicine
  const updatedMedicines = medicines.map(med => 
    med.id === id ? { ...med, stock: newStock } : med
  );
  
  return Promise.resolve(updatedMedicines.find(med => med.id === id) || null);
};

export const addMedicine = (medicine: Omit<Medicine, "id">) => {
  // In a real app, this would make an API call
  // For the demo, we'll create a new medicine with a random ID
  const newMedicine: Medicine = {
    ...medicine,
    id: `med-${Math.floor(Math.random() * 1000)}`
  };
  
  // We would add this to our database
  medicines.push(newMedicine);
  return Promise.resolve(newMedicine);
};

export const deleteMedicine = (id: string) => {
  // In a real app, this would make an API call
  // For the demo, we'll remove the medicine from our array
  const index = medicines.findIndex(med => med.id === id);
  if (index !== -1) {
    medicines.splice(index, 1);
  }
  
  return Promise.resolve(true);
};
