
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { getOrdersByCustomer } from "../../services/orderService";
import { Order } from "../../types/order";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { ShoppingCart, Package, Calendar, Search } from "lucide-react";

const CustomerDashboard = () => {
  const { user, isAuthenticated, currentRole } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
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
          const orders = await getOrdersByCustomer(user.id);
          setRecentOrders(orders.slice(0, 3)); // Get the 3 most recent orders
        } catch (error) {
          console.error("Error loading orders:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadOrders();
  }, [isAuthenticated, currentRole, navigate, user]);

  const getStatusColor = (status: string) => {
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
            title={`Welcome, ${user?.name || 'Customer'}`} 
            description="Manage your medicines and orders"
          />
          
          {/* Quick Actions */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/customer/pharmacy-selection">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Search className="h-10 w-10 text-medishare-primary mb-3" />
                    <h3 className="font-medium">Find Pharmacy</h3>
                    <p className="text-sm text-gray-500 mt-1">Browse local pharmacies</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/customer/medicine-browse">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Package className="h-10 w-10 text-medishare-primary mb-3" />
                    <h3 className="font-medium">Browse Medicines</h3>
                    <p className="text-sm text-gray-500 mt-1">Find and order medicines</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/customer/cart">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <ShoppingCart className="h-10 w-10 text-medishare-primary mb-3" />
                    <h3 className="font-medium">View Cart</h3>
                    <p className="text-sm text-gray-500 mt-1">Review and checkout</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/customer/order-tracking">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Calendar className="h-10 w-10 text-medishare-primary mb-3" />
                    <h3 className="font-medium">Track Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">View order status</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
          
          {/* Recent Orders */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/customer/order-tracking">
                <Button variant="link" className="text-medishare-primary">View All Orders</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <p className="font-medium text-gray-700">Order #{order.id}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.pharmacyName}
                          </p>
                          <p className="text-sm font-medium mt-2">${order.totalAmount.toFixed(2)} • {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex flex-col md:items-end">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <Link to={`/customer/order-tracking?id=${order.id}`} className="mt-2 text-sm text-medishare-primary hover:underline">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
                  <Link to="/customer/pharmacy-selection">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
