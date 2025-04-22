
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { usePharmacy } from "../../contexts/PharmacyContext";
import { addPharmacy } from "../../services/pharmacyService";
import { Pharmacy } from "../../types/pharmacy";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";

const PharmacySetup = () => {
  const { isAuthenticated, currentRole, user } = useAuth();
  const { setPharmacy } = usePharmacy();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    description: "",
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (currentRole !== "pharmacist") {
      navigate("/role-selection");
      return;
    }
  }, [isAuthenticated, currentRole, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newPharmacy: Omit<Pharmacy, "id" | "rating" | "reviewCount"> = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        description: formData.description,
        ownerId: user?.id || '',
        imageUrl: `/placeholder.svg`
      };
      
      const pharmacy = await addPharmacy(newPharmacy);
      setPharmacy(pharmacy);
      
      toast({
        title: "Pharmacy Created",
        description: "Your pharmacy has been successfully created",
      });
      
      navigate("/pharmacist");
    } catch (error) {
      console.error("Error creating pharmacy:", error);
      toast({
        title: "Error",
        description: "There was an error creating your pharmacy",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <PageHeader 
            title="Set Up Your Pharmacy" 
            description="Before you can start managing your inventory, please set up your pharmacy details"
          />
          
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Pharmacy Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address*</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City*</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State*</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">Zip Code*</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">Create Pharmacy</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PharmacySetup;
