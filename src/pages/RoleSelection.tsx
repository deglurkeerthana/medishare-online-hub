
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, UserRole } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Package, User } from "lucide-react";

const RoleSelection = () => {
  const { user, isAuthenticated, currentRole, setCurrentRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    if (currentRole) {
      if (currentRole === "customer") {
        navigate("/customer");
      } else {
        navigate("/pharmacist");
      }
    }
  }, [isAuthenticated, currentRole, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    
    if (role === "customer") {
      navigate("/customer");
    } else {
      navigate("/pharmacist");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Package className="h-12 w-12 text-medishare-primary" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome to MediShare</h2>
            <p className="mt-2 text-gray-600">
              {user?.name ? `Hello ${user.name}! ` : ''}
              How would you like to use MediShare today?
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRoleSelect("customer")}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-medishare-light rounded-full mb-4">
                  <User className="w-8 h-8 text-medishare-primary" />
                </div>
                <CardTitle>I want to Buy</CardTitle>
                <CardDescription>Order medicines as a customer</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Browse and purchase medicines from local pharmacies and get them delivered to your doorstep.
                </p>
                <Button 
                  className="w-full bg-medishare-primary hover:bg-medishare-dark"
                  onClick={() => handleRoleSelect("customer")}
                >
                  Continue as Customer
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleRoleSelect("pharmacist")}>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-medishare-light rounded-full mb-4">
                  <Package className="w-8 h-8 text-medishare-primary" />
                </div>
                <CardTitle>I want to Sell</CardTitle>
                <CardDescription>Manage inventory as a pharmacist</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Manage your pharmacy's inventory, process orders, and track deliveries to customers.
                </p>
                <Button 
                  className="w-full bg-medishare-primary hover:bg-medishare-dark"
                  onClick={() => handleRoleSelect("pharmacist")}
                >
                  Continue as Pharmacist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RoleSelection;
