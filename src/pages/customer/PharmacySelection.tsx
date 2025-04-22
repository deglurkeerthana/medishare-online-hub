import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { getPharmacies } from "../../services/pharmacyService";
import { Pharmacy } from "../../types/pharmacy";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { Star, Search, MapPin, Clock } from "lucide-react";

const PharmacySelection = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (currentRole !== "customer") {
      navigate("/role-selection");
      return;
    }
    
    const loadPharmacies = async () => {
      try {
        const data = await getPharmacies();
        setPharmacies(data);
      } catch (error) {
        console.error("Error loading pharmacies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPharmacies();
  }, [isAuthenticated, currentRole, navigate]);

  const filteredPharmacies = pharmacies.filter(pharmacy => 
    pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Select a Pharmacy" 
            description="Choose from our network of trusted local pharmacies"
          />
          
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by pharmacy name or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading pharmacies...</div>
            </div>
          ) : filteredPharmacies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPharmacies.map((pharmacy) => (
                <Card key={pharmacy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {pharmacy.imageUrl ? (
                      <img
                        src={pharmacy.imageUrl}
                        alt={pharmacy.name}
                        className="w-32 h-32 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2" fill="#e5e7eb"/><path d="M6 8h4M8 6v4M9 15v2" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><rect x="14" y="11" width="6" height="6" rx="1.5" fill="#cbd5e1"/></svg>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      {pharmacy.name}
                    </h3>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(pharmacy.rating)}
                      </div>
                      <span className="text-sm text-gray-600">{pharmacy.rating.toFixed(1)}</span>
                    </div>
                    
                    <div className="flex items-start space-x-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    {pharmacy.openingHours && (
                      <div className="flex items-start space-x-2 text-sm text-gray-600 mb-3">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{pharmacy.openingHours}</span>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pharmacy.description}</p>
                    
                    <div className="flex justify-between items-center">
                      {pharmacy.distance && (
                        <span className="text-sm font-medium text-medishare-primary">{pharmacy.distance} away</span>
                      )}
                      <Link to={`/customer/medicine-browse?pharmacy=${pharmacy.id}`}>
                        <Button size="sm">Select</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No pharmacies found matching your search criteria.</p>
              <Button onClick={() => setSearchTerm("")}>Show All Pharmacies</Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PharmacySelection;
