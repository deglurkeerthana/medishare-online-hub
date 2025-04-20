
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getOrderById, getOrdersByPharmacy, updateOrderStatus } from "../../services/orderService";
import { Order, OrderStatus } from "../../types/order";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { Search, Clock, Package, Truck, Home } from "lucide-react";

const OrderManagement = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (currentRole !== "pharmacist") {
      navigate("/role-selection");
      return;
    }
    
    const loadOrders = async () => {
      try {
        // For demo, we'll use pharmacy-1 as the default pharmacy
        const allOrders = await getOrdersByPharmacy("pharm-1");
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        
        const orderId = searchParams.get("id");
        if (orderId) {
          const order = await getOrderById(orderId);
          if (order) {
            setSelectedOrder(order);
          }
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [isAuthenticated, currentRole, navigate, searchParams]);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchTerm]);

  const filterOrders = () => {
    let filtered = [...orders];
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.shippingAddress.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.trackingNumber || "");
    setUpdateDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    try {
      const updatedOrder = await updateOrderStatus(selectedOrder.id, newStatus);
      
      // Update tracking number if provided and status is shipped
      if (newStatus === "shipped" && trackingNumber) {
        // In a real app, we would update the tracking number in the backend
        // For demo purposes, we'll just update it locally
        if (updatedOrder) {
          updatedOrder.trackingNumber = trackingNumber;
        }
      }
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id ? { ...order, status: newStatus, trackingNumber: trackingNumber || order.trackingNumber } : order
        )
      );
      
      toast({
        title: "Order Updated",
        description: `Order #${selectedOrder.id} status updated to ${newStatus}`,
      });
      
      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "There was an error updating the order status.",
        variant: "destructive"
      });
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Order Management" 
            description="View and process customer orders"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by order ID or address..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Filter by Status</Label>
                      <div className="flex flex-wrap gap-2">
                        {["all", "pending", "processing", "shipped", "delivered"].map((status) => (
                          <Badge
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            className={`cursor-pointer ${statusFilter === status ? "bg-medishare-primary" : ""}`}
                            onClick={() => setStatusFilter(status as OrderStatus | "all")}
                          >
                            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Loading orders...</div>
                    </div>
                  ) : filteredOrders.length > 0 ? (
                    <ul className="divide-y">
                      {filteredOrders.map((order) => (
                        <li 
                          key={order.id} 
                          className={`py-3 px-4 cursor-pointer hover:bg-gray-50 ${selectedOrder?.id === order.id ? 'bg-gray-50' : ''}`}
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
                          <p className="text-sm mt-1">${order.totalAmount.toFixed(2)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No orders found matching your criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedOrder ? (
                <Card>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>Order #{selectedOrder.id}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedOrder)}
                      disabled={selectedOrder.status === "delivered"}
                    >
                      Update Status
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                        <p>{selectedOrder.paymentMethod}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
                        <p className="font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.trackingNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h3>
                        <p>{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h3>
                      <p className="text-gray-800">{selectedOrder.shippingAddress}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <Card>
                        <CardContent className="p-0">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">Item</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">Quantity</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">Price</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items.map((item, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-3 px-4">
                                    <p className="font-medium">{item.medicineName}</p>
                                  </td>
                                  <td className="py-3 px-4">{item.quantity}</td>
                                  <td className="py-3 px-4">${item.price.toFixed(2)}</td>
                                  <td className="py-3 px-4 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Order Status Timeline</h3>
                      <div className="space-y-4">
                        {[
                          { status: "pending", label: "Order Placed", icon: Clock, date: new Date(selectedOrder.createdAt).toLocaleDateString() },
                          { status: "processing", label: "Processing", icon: Package, date: selectedOrder.status === "processing" || selectedOrder.status === "shipped" || selectedOrder.status === "delivered" ? new Date(selectedOrder.updatedAt).toLocaleDateString() : null },
                          { status: "shipped", label: "Shipped", icon: Truck, date: selectedOrder.status === "shipped" || selectedOrder.status === "delivered" ? new Date(selectedOrder.updatedAt).toLocaleDateString() : null },
                          { status: "delivered", label: "Delivered", icon: Home, date: selectedOrder.status === "delivered" ? new Date(selectedOrder.updatedAt).toLocaleDateString() : null }
                        ].map((step, index) => {
                          const isCompleted = ["pending", "processing", "shipped", "delivered"].indexOf(selectedOrder.status) >= ["pending", "processing", "shipped", "delivered"].indexOf(step.status as OrderStatus);
                          return (
                            <div key={step.status} className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-medishare-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <step.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium">{step.label}</p>
                                {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                              </div>
                            </div>
                          );
                        })}
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
          
          {/* Update Status Dialog */}
          <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Update the status for Order #{selectedOrder?.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Order Status</Label>
                  <RadioGroup 
                    value={newStatus} 
                    onValueChange={(value: OrderStatus) => setNewStatus(value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending" className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Pending
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="processing" id="processing" />
                      <Label htmlFor="processing" className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Processing
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="shipped" id="shipped" />
                      <Label htmlFor="shipped" className="flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        Shipped
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivered" id="delivered" />
                      <Label htmlFor="delivered" className="flex items-center">
                        <Home className="w-4 h-4 mr-2" />
                        Delivered
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {newStatus === "shipped" && (
                  <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleStatusUpdate}>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderManagement;
