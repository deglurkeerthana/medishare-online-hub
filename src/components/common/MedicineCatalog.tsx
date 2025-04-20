
import { useState } from "react";
import { Link } from "react-router-dom";
import { Medicine } from "../../types/medicine";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Search } from "lucide-react";

interface MedicineCatalogProps {
  medicines: Medicine[];
  showControls?: boolean;
}

const MedicineCatalog = ({ medicines, showControls = true }: MedicineCatalogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();
  
  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {showControls && (
        <div className="mb-6">
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
      )}

      {filteredMedicines.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No medicines found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={medicine.imageUrl}
                  alt={medicine.name}
                  className="h-32 w-32 object-contain"
                />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/customer/medicine/${medicine.id}`} className="text-lg font-semibold text-medishare-dark hover:text-medishare-primary">
                    {medicine.name}
                  </Link>
                  <Badge variant={medicine.requires_prescription ? "destructive" : "secondary"} className="ml-2">
                    {medicine.requires_prescription ? "Rx" : "OTC"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  {medicine.dosage} • {medicine.category}
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {medicine.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-medishare-dark font-bold">
                    ${medicine.price.toFixed(2)}
                  </div>
                  
                  {showControls && (
                    <div className="flex space-x-2">
                      <Link to={`/customer/medicine/${medicine.id}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                      <Button 
                        size="sm"
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock <= 0 || medicine.requires_prescription}
                      >
                        {medicine.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      </Button>
                    </div>
                  )}
                </div>
                
                {medicine.stock <= 5 && medicine.stock > 0 && (
                  <p className="text-xs text-orange-500 mt-2">
                    Only {medicine.stock} left in stock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineCatalog;
