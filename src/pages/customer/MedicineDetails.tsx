
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { getMedicineById } from "../../services/medicineService";
import { Medicine } from "../../types/medicine";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { CheckCircle, XCircle, AlertCircle, Package, ShoppingCart, IndianRupee, DollarSign } from "lucide-react";

const MedicineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, currentRole } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyType, setCurrencyType] = useState<"USD" | "INR">("USD");
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
    
    const loadMedicine = async () => {
      if (id) {
        try {
          const data = await getMedicineById(id);
          setMedicine(data);
        } catch (error) {
          console.error("Error loading medicine:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadMedicine();
  }, [id, isAuthenticated, currentRole, navigate]);

  const handleAddToCart = () => {
    if (medicine) {
      addToCart(medicine, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`,
      });
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && medicine && newQuantity <= medicine.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    if (currencyType === "USD") {
      return `$${price.toFixed(2)}`;
    } else {
      return `₹${(price * exchangeRate).toFixed(2)}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-gray-500">Loading medicine details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h2>
            <p className="text-gray-600 mb-4">The medicine you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/customer/medicine-browse")}>Browse Medicines</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button onClick={() => navigate(-1)} className="text-medishare-primary hover:underline flex items-center">
              <span>← Back</span>
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center h-full">
                  <img
                    src={medicine.imageUrl}
                    alt={medicine.name}
                    className="max-h-64 max-w-full object-contain"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{medicine.name}</h1>
                  <Badge variant={medicine.requires_prescription ? "destructive" : "secondary"} className="text-sm">
                    {medicine.requires_prescription ? "Prescription Required" : "Over The Counter"}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-lg font-semibold text-medishare-primary flex items-center">
                    {currencyType === "USD" ? (
                      <DollarSign className="w-4 h-4 mr-1" />
                    ) : (
                      <IndianRupee className="w-4 h-4 mr-1" />
                    )}
                    {currencyType === "USD" ? 
                      medicine.price.toFixed(2) : 
                      (medicine.price * exchangeRate).toFixed(2)
                    }
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Currency:</Label>
                    <Select 
                      value={currencyType}
                      onValueChange={(value: "USD" | "INR") => setCurrencyType(value)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  {medicine.dosage} • {medicine.category}
                </div>
                
                <p className="text-gray-700 mb-6">{medicine.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Package className="w-5 h-5 mr-2 text-gray-500" />
                    <span>
                      {medicine.stock > 10 ? (
                        <span className="text-green-600 font-medium">In Stock</span>
                      ) : medicine.stock > 0 ? (
                        <span className="text-orange-500 font-medium">Low Stock: Only {medicine.stock} left</span>
                      ) : (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      )}
                    </span>
                  </div>
                </div>
                
                {!medicine.requires_prescription && medicine.stock > 0 && (
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => handleQuantityChange(-1)} 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)} 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        disabled={quantity >= medicine.stock}
                      >
                        +
                      </button>
                    </div>
                    
                    <Button onClick={handleAddToCart} className="flex gap-2 items-center">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                )}
                
                {medicine.requires_prescription && (
                  <Card className="bg-red-50 mb-6">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-700 font-medium">Prescription Required</p>
                        <p className="text-sm text-red-600">
                          This medicine requires a valid prescription. Please upload your prescription during checkout.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            <div className="border-t p-6">
              <Tabs defaultValue="usage">
                <TabsList>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="sideEffects">Side Effects</TabsTrigger>
                </TabsList>
                
                <TabsContent value="usage" className="pt-4">
                  <p className="text-gray-700">{medicine.usage}</p>
                </TabsContent>
                
                <TabsContent value="benefits" className="pt-4">
                  <ul className="space-y-2">
                    {medicine.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="sideEffects" className="pt-4">
                  <ul className="space-y-2">
                    {medicine.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MedicineDetails;
