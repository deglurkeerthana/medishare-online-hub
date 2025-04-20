
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { getOrdersByPharmacy } from "../../services/orderService";
import { Order } from "../../types/order";
import { getAllMedicines } from "../../services/medicineService";
import { Medicine } from "../../types/medicine";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { PackageCheck, Package, ShoppingCart, AlertCircle } from "lucide-react";

const PharmacistDashboard = () => {
  const { user, isAuthenticated, currentRole } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Medicine[]>([]);
  const [orderCounts, setOrderCounts] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0
  });
  const [isLoading, setIsLoading] = useState(true);
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
    
    const loadData = async () => {
      try {
        // For demo, we'll use pharmacy-1 as the default pharmacy
        const orders = await getOrdersByPharmacy("pharm-1");
        setRecentOrders(orders.slice(0, 5)); // Get the 5 most recent orders
        
        // Calculate order counts
        setOrderCounts({
          total: orders.length,
          pending: orders.filter(order => order.status === "pending").length,
          processing: orders.filter(order => order.status === "processing").length,
          shipped: orders.filter(order => order.status === "shipped").length,
          delivered: orders.filter(order => order.status === "delivered").length
        });
        
        // Get low stock items (less than 10 in stock)
        const medicines = await getAllMedicines();
        setLowStockItems(medicines.filter(med => med.stock < 10));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
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
            title={`Welcome, ${user?.name || 'Pharmacist'}`} 
            description="Manage your pharmacy's inventory and orders"
          />
          
          {/* Dashboard Stats */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold">{orderCounts.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending Orders</p>
                      <p className="text-2xl font-bold">{orderCounts.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <PackageCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Processing</p>
                      <p className="text-2xl font-bold">{orderCounts.processing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Low Stock Items</p>
                      <p className="text-2xl font-bold">{lowStockItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Quick Actions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/pharmacist/inventory">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-medishare-light flex items-center justify-center mr-4">
                      <Package className="w-6 h-6 text-medishare-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Manage Inventory</h3>
                      <p className="text-sm text-gray-500">Add, update, or remove medicines from your inventory</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/pharmacist/orders">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-medishare-light flex items-center justify-center mr-4">
                      <ShoppingCart className="w-6 h-6 text-medishare-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Process Orders</h3>
                      <p className="text-sm text-gray-500">View and update the status of customer orders</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
          
          {/* Recent Orders */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/pharmacist/orders">
                <Button variant="link" className="text-medishare-primary">View All Orders</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : recentOrders.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Order ID</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Items</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Total</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{order.id}</td>
                            <td className="py-3 px-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm">{order.items.length}</td>
                            <td className="py-3 px-4 text-sm font-medium">${order.totalAmount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Link to={`/pharmacist/orders?id=${order.id}`}>
                                <Button variant="link" size="sm" className="p-0 h-auto text-medishare-primary">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No recent orders to display.</p>
                </CardContent>
              </Card>
            )}
          </section>
          
          {/* Low Stock Items */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Low Stock Items</h2>
              <Link to="/pharmacist/inventory">
                <Button variant="link" className="text-medishare-primary">Manage Inventory</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading inventory...</div>
              </div>
            ) : lowStockItems.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Current Stock</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockItems.map((medicine) => (
                          <tr key={medicine.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{medicine.name}</td>
                            <td className="py-3 px-4 text-sm">{medicine.category}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${medicine.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {medicine.stock} left
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">${medicine.price.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <Link to={`/pharmacist/inventory`}>
                                <Button variant="link" size="sm" className="p-0 h-auto text-medishare-primary">
                                  Update Stock
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No low stock items to display.</p>
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

export default PharmacistDashboard;
