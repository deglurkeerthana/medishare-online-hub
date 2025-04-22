
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../../contexts/AuthContext";
import { getAllMedicines, getMedicinesByCategory } from "../../services/medicineService";
import { getPharmacyById } from "../../services/pharmacyService";
import { Medicine } from "../../types/medicine";
import { Pharmacy } from "../../types/pharmacy";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import MedicineCatalog from "../../components/common/MedicineCatalog";
import { Search } from "lucide-react";

// Define medicine categories
const CATEGORIES = ["All", "Pain Relief", "Antibiotics", "Cardiovascular", "Allergy Relief", "Diabetes"];

const MedicineBrowse = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyType, setCurrencyType] = useState<"USD" | "INR">("USD"); // Added for currency toggle
  const navigate = useNavigate();

  const exchangeRate = 83.15; // 1 USD = 83.15 INR (as of April 2025)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (currentRole !== "customer") {
      navigate("/role-selection");
      return;
    }
    
    const pharmacyId = searchParams.get("pharmacy");
    
    const loadData = async () => {
      try {
        // If pharmacy ID is provided, fetch pharmacy details
        if (pharmacyId) {
          const pharmacyData = await getPharmacyById(pharmacyId);
          setPharmacy(pharmacyData);
        }
        
        // Load all medicines
        const medicinesData = await getAllMedicines();
        setMedicines(medicinesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isAuthenticated, currentRole, navigate, searchParams]);

  const handleCategoryChange = async (category: string) => {
    setActiveCategory(category);
    setIsLoading(true);
    
    try {
      if (category === "All") {
        const medicinesData = await getAllMedicines();
        setMedicines(medicinesData);
      } else {
        const medicinesData = await getMedicinesByCategory(category);
        setMedicines(medicinesData);
      }
    } catch (error) {
      console.error("Error loading medicines by category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title={pharmacy ? `Medicines from ${pharmacy.name}` : "Browse Medicines"} 
            description={pharmacy ? `Browse available medicines from ${pharmacy.name}` : "Find the medicines you need"}
          />
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="mb-6 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center mb-6 space-x-4">
              <label className="text-sm font-medium">Currency:</label>
              <Button 
                variant={currencyType === "USD" ? "default" : "outline"} 
                onClick={() => setCurrencyType("USD")}
                size="sm"
              >
                USD ($)
              </Button>
              <Button 
                variant={currencyType === "INR" ? "default" : "outline"} 
                onClick={() => setCurrencyType("INR")}
                size="sm"
              >
                INR (₹)
              </Button>
            </div>
            <Tabs defaultValue="All" value={activeCategory} onValueChange={handleCategoryChange}>
              <TabsList className="mb-6 flex flex-wrap">
                {CATEGORIES.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {CATEGORIES.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Loading medicines...</div>
                    </div>
                  ) : filteredMedicines.length > 0 ? (
                    <MedicineCatalog 
                      medicines={filteredMedicines} 
                      showControls={false}
                      currencyType={currencyType}
                      exchangeRate={exchangeRate}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No medicines found matching your search criteria.</p>
                      <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedicineBrowse;
