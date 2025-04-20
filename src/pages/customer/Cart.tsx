
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { Package, ShoppingCart, Trash } from "lucide-react";

const Cart = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
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
  }, [isAuthenticated, currentRole, navigate]);

  const handleQuantityChange = (medicineId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateQuantity(medicineId, newQuantity);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Your Cart" 
            description={`${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
          />
          
          {items.length === 0 ? (
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Your cart is empty</CardTitle>
              </CardHeader>
              <CardContent className="py-10">
                <div className="flex justify-center mb-6">
                  <ShoppingCart className="w-20 h-20 text-gray-300" />
                </div>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added any medicines to your cart yet.
                </p>
                <Button onClick={() => navigate("/customer/medicine-browse")} className="mx-auto">
                  Browse Medicines
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {items.map((item) => (
                        <li key={item.medicine.id} className="py-4">
                          <div className="flex flex-col sm:flex-row">
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center mr-4 mb-4 sm:mb-0">
                              <img 
                                src={item.medicine.imageUrl} 
                                alt={item.medicine.name} 
                                className="max-h-16 max-w-16 object-contain"
                              />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex justify-between">
                                <Link to={`/customer/medicine/${item.medicine.id}`} className="text-lg font-medium text-gray-900 hover:text-medishare-primary">
                                  {item.medicine.name}
                                </Link>
                                <button 
                                  onClick={() => removeFromCart(item.medicine.id)} 
                                  className="text-gray-400 hover:text-red-500"
                                  aria-label="Remove item"
                                >
                                  <Trash className="w-5 h-5" />
                                </button>
                              </div>
                              
                              <div className="text-sm text-gray-500 mb-2">
                                {item.medicine.dosage} • {item.medicine.category}
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center border rounded-md">
                                  <button 
                                    onClick={() => handleQuantityChange(item.medicine.id, item.quantity, -1)} 
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-4 py-1 border-x">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleQuantityChange(item.medicine.id, item.quantity, 1)} 
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    disabled={item.quantity >= item.medicine.stock}
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <div className="text-medishare-dark font-bold">
                                  ${(item.medicine.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => navigate("/customer/medicine-browse")}>
                      Continue Shopping
                    </Button>
                    <Button variant="destructive" onClick={() => items.forEach(item => removeFromCart(item.medicine.id))}>
                      Clear Cart
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">$5.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${(totalPrice * 0.05).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">
                          ${(totalPrice + 5 + totalPrice * 0.05).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center gap-2" 
                      onClick={() => navigate("/customer/checkout")}
                    >
                      <Package className="w-4 h-4" />
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
