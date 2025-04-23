
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { createOrder } from "../../services/orderService";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { CreditCard, Package, UserCheck, MapPin } from "lucide-react";

const Checkout = () => {
  const { user, isAuthenticated, currentRole } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });

  // Shipping and tax calculation
  const shippingCost = 5.00;
  const taxAmount = totalPrice * 0.05;
  const orderTotal = totalPrice + shippingCost + taxAmount;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (currentRole !== "customer") {
      navigate("/role-selection");
      return;
    }
    
    if (items.length === 0) {
      navigate("/customer/cart");
      return;
    }
  }, [isAuthenticated, currentRole, navigate, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const { fullName, address, city, zipCode, phone } = shippingInfo;
    if (!fullName || !address || !city || !zipCode || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Format order items
      const orderItems = items.map(item => ({
        medicineId: item.medicine.id,
        medicineName: item.medicine.name,
        quantity: item.quantity,
        price: item.medicine.price
      }));
      
      // Create order object
      const order = {
        customerId: user?.id || "guest",
        pharmacyId: "pharm-1", // Default pharmacy for demo
        pharmacyName: "HealthPlus Pharmacy", // Default pharmacy for demo
        items: orderItems,
        totalAmount: orderTotal,
        status: "pending" as const,
        shippingAddress: `${fullName}, ${address}, ${city}, ${zipCode}`,
        paymentMethod: paymentMethod
      };
      
      // Create order
      const createdOrder = await createOrder(order);
      
      // Clear cart
      clearCart();
      
      // Show success toast
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${createdOrder.id} has been placed`,
      });
      
      // Redirect to order tracking
      navigate(`/customer/order-tracking?id=${createdOrder.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Checkout" 
            description="Complete your order"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name*</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={shippingInfo.fullName} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          value={shippingInfo.phone} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address*</Label>
                      <Textarea 
                        id="address" 
                        name="address" 
                        value={shippingInfo.address} 
                        onChange={handleInputChange} 
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City*</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={shippingInfo.city} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code*</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          value={shippingInfo.zipCode} 
                          onChange={handleInputChange} 
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader className="flex flex-row items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 border p-4 rounded-md bg-white">
                        <RadioGroupItem value="creditCard" id="creditCard" />
                        <Label htmlFor="creditCard" className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 border p-4 rounded-md bg-white">
                        <RadioGroupItem value="cashOnDelivery" id="cashOnDelivery" />
                        <Label htmlFor="cashOnDelivery">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "creditCard" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expDate">Expiration Date</Label>
                            <Input id="expDate" placeholder="MM / YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nameOnCard">Name on Card</Label>
                          <Input id="nameOnCard" placeholder="John Doe" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="lg:hidden">
                  <OrderSummary 
                    items={items}
                    totalPrice={totalPrice}
                    shippingCost={shippingCost}
                    taxAmount={taxAmount}
                    orderTotal={orderTotal}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing Order..." : "Place Order"}
                </Button>
              </form>
            </div>
            
            <div className="hidden lg:block">
              <OrderSummary 
                items={items}
                totalPrice={totalPrice}
                shippingCost={shippingCost}
                taxAmount={taxAmount}
                orderTotal={orderTotal}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  items: any[];
  totalPrice: number;
  shippingCost: number;
  taxAmount: number;
  orderTotal: number;
}

const OrderSummary = ({ items, totalPrice, shippingCost, taxAmount, orderTotal }: OrderSummaryProps) => {
  return (
    <Card className="sticky top-6">
      <CardHeader className="flex flex-row items-center">
        <Package className="w-5 h-5 mr-2" />
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y mb-4">
          {items.map((item) => (
            <li key={item.medicine.id} className="py-3 flex justify-between">
              <div>
                <span className="font-medium">{item.medicine.name}</span>
                <div className="text-sm text-gray-500">
                  Qty: {item.quantity} x ₹{item.medicine.price.toFixed(2)}
                </div>
              </div>
              <span className="font-medium">
                ₹{(item.medicine.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (5%)</span>
            <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">
              ₹{orderTotal.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 space-y-1">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Delivery usually takes 1-3 business days depending on your location</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Checkout;
