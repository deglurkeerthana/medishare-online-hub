
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { getOrderById, getOrdersByCustomer } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/order";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { Check, Package, Clock, Truck, Home } from "lucide-react";

const OrderTracking = () => {
  const { user, isAuthenticated, currentRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
    
    const loadOrders = async () => {
      if (user) {
        try {
          const orderId = searchParams.get("id");
          
          if (orderId) {
            const order = await getOrderById(orderId);
            if (order) {
              setSelectedOrder(order);
            }
          }
          
          const customerOrders = await getOrdersByCustomer(user.id);
          setOrders(customerOrders);
        } catch (error) {
          console.error("Error loading orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadOrders();
  }, [isAuthenticated, currentRole, navigate, user, searchParams]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepStatus = (orderStatus: OrderStatus, step: OrderStatus) => {
    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const orderIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(step);
    
    if (orderIndex === stepIndex) return "current";
    if (orderIndex > stepIndex) return "completed";
    return "upcoming";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Order Tracking" 
            description="Track and manage your orders"
          />
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Package className="w-16 h-16 text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't placed any orders yet. Start shopping to place your first order.
                </p>
                <Button onClick={() => navigate("/customer/medicine-browse")}>
                  Browse Medicines
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y">
                      {orders.map((order) => (
                        <li 
                          key={order.id} 
                          className={`py-3 px-2 cursor-pointer rounded hover:bg-gray-50 ${selectedOrder?.id === order.id ? 'bg-gray-50' : ''}`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Order #{order.id}</p>
                              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{order.pharmacyName}</p>
                          <p className="text-sm font-medium mt-1">${order.totalAmount.toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedOrder ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Order #{selectedOrder.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-8">
                        <div className="flex justify-between mb-6">
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p>{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p>{selectedOrder.paymentMethod}</p>
                          </div>
                        </div>
                        
                        {/* Order Tracking Steps */}
                        <div className="relative">
                          <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                            <div 
                              className="bg-medishare-primary"
                              style={{ 
                                width: 
                                  selectedOrder.status === "pending" ? "25%" :
                                  selectedOrder.status === "processing" ? "50%" :
                                  selectedOrder.status === "shipped" ? "75%" :
                                  "100%"
                              }}
                            />
                          </div>
                          
                          <div className="flex justify-between">
                            {[
                              { status: "pending", label: "Order Placed", icon: <Clock className="w-5 h-5" /> },
                              { status: "processing", label: "Processing", icon: <Package className="w-5 h-5" /> },
                              { status: "shipped", label: "Shipped", icon: <Truck className="w-5 h-5" /> },
                              { status: "delivered", label: "Delivered", icon: <Home className="w-5 h-5" /> }
                            ].map((step, index) => {
                              const stepStatus = getStepStatus(selectedOrder.status, step.status as OrderStatus);
                              return (
                                <div key={step.status} className="text-center flex flex-col items-center">
                                  <div 
                                    className={`
                                      w-10 h-10 flex items-center justify-center rounded-full
                                      ${stepStatus === "completed" ? "bg-medishare-primary text-white" :
                                        stepStatus === "current" ? "bg-medishare-light border-2 border-medishare-primary text-medishare-primary" :
                                        "bg-gray-200 text-gray-400"
                                      }
                                    `}
                                  >
                                    {stepStatus === "completed" ? <Check className="w-5 h-5" /> : step.icon}
                                  </div>
                                  <div className="mt-2 text-sm font-medium">{step.label}</div>
                                  {stepStatus === "current" && (
                                    <div className="text-xs text-medishare-primary mt-1">Current Status</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Order Details */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                        
                        <div className="mb-6">
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Items</h4>
                          <ul className="divide-y border-t border-b">
                            {selectedOrder.items.map((item, index) => (
                              <li key={index} className="py-3 flex justify-between">
                                <div>
                                  <p className="font-medium">{item.medicineName}</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {selectedOrder.trackingNumber && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Tracking Number</h4>
                            <p className="text-gray-600">{selectedOrder.trackingNumber}</p>
                          </div>
                        )}
                        
                        <div className="mt-6 flex justify-center">
                          <Button variant="outline" onClick={() => navigate("/customer/medicine-browse")}>
                            Continue Shopping
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">
                        Select an order from the list to view its details.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
