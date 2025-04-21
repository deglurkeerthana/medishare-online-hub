
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import PharmacySelection from "./pages/customer/PharmacySelection";
import MedicineBrowse from "./pages/customer/MedicineBrowse";
import MedicineDetails from "./pages/customer/MedicineDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import OrderTracking from "./pages/customer/OrderTracking";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import InventoryManagement from "./pages/pharmacist/InventoryManagement";
import OrderManagement from "./pages/pharmacist/OrderManagement";
import NotFound from "./pages/NotFound";

// Create a simple QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                
                {/* Customer Routes */}
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route path="/customer/pharmacy-selection" element={<PharmacySelection />} />
                <Route path="/customer/medicine-browse" element={<MedicineBrowse />} />
                <Route path="/customer/medicine/:id" element={<MedicineDetails />} />
                <Route path="/customer/cart" element={<Cart />} />
                <Route path="/customer/checkout" element={<Checkout />} />
                <Route path="/customer/order-tracking" element={<OrderTracking />} />
                
                {/* Pharmacist Routes */}
                <Route path="/pharmacist" element={<PharmacistDashboard />} />
                <Route path="/pharmacist/inventory" element={<InventoryManagement />} />
                <Route path="/pharmacist/orders" element={<OrderManagement />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
