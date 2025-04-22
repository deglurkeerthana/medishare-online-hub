
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Pharmacy } from "../types/pharmacy";
import { useAuth } from "./AuthContext";
import { getPharmacies } from "../services/pharmacyService";

interface PharmacyContextType {
  pharmacy: Pharmacy | null;
  setPharmacy: (pharmacy: Pharmacy | null) => void;
  pharmacies: Pharmacy[];
  loading: boolean;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPharmacies = async () => {
      try {
        const data = await getPharmacies();
        setPharmacies(data);
        
        // If user has a preferred pharmacy, set it
        if (user?.id) {
          const savedPharmacyId = localStorage.getItem(`pharmacy_${user.id}`);
          if (savedPharmacyId) {
            const savedPharmacy = data.find(p => p.id === savedPharmacyId);
            if (savedPharmacy) {
              setPharmacy(savedPharmacy);
            }
          }
        }
      } catch (error) {
        console.error("Error loading pharmacies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPharmacies();
  }, [user]);
  
  const handleSetPharmacy = (selectedPharmacy: Pharmacy | null) => {
    setPharmacy(selectedPharmacy);
    
    // Save user's pharmacy preference
    if (user?.id && selectedPharmacy) {
      localStorage.setItem(`pharmacy_${user.id}`, selectedPharmacy.id);
    }
  };

  return (
    <PharmacyContext.Provider
      value={{
        pharmacy,
        setPharmacy: handleSetPharmacy,
        pharmacies,
        loading
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error("usePharmacy must be used within a PharmacyProvider");
  }
  return context;
};
