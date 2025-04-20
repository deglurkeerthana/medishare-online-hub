
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import { getAllMedicines, updateMedicineStock } from "../../services/medicineService";
import { Medicine } from "../../types/medicine";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import PageHeader from "../../components/common/PageHeader";
import { Search, Plus, PencilLine } from "lucide-react";

const InventoryManagement = () => {
  const { isAuthenticated, currentRole } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state for edit dialog
  const [editForm, setEditForm] = useState({
    stock: 0
  });

  // Form state for add dialog
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: 0,
    dosage: "",
    sideEffects: "",
    benefits: "",
    usage: "",
    stock: 0,
    category: "",
    requires_prescription: false
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
    
    const loadMedicines = async () => {
      try {
        const data = await getAllMedicines();
        setMedicines(data);
      } catch (error) {
        console.error("Error loading medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMedicines();
  }, [isAuthenticated, currentRole, navigate]);

  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setEditForm({
      stock: medicine.stock
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedMedicine) return;
    
    try {
      const updatedMedicine = await updateMedicineStock(selectedMedicine.id, editForm.stock);
      
      // Update the medicines list
      setMedicines(prevMedicines => 
        prevMedicines.map(med => 
          med.id === selectedMedicine.id ? { ...med, stock: editForm.stock } : med
        )
      );
      
      toast({
        title: "Stock Updated",
        description: `${selectedMedicine.name} stock updated to ${editForm.stock}`,
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "There was an error updating the stock.",
        variant: "destructive"
      });
    }
  };

  const handleAddSubmit = () => {
    // In a real app, this would call an API to add the medicine
    // For the demo, we'll just show a toast
    toast({
      title: "Medicine Added",
      description: `${addForm.name} has been added to your inventory`,
    });
    
    setAddDialogOpen(false);
    setAddForm({
      name: "",
      description: "",
      price: 0,
      dosage: "",
      sideEffects: "",
      benefits: "",
      usage: "",
      stock: 0,
      category: "",
      requires_prescription: false
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="Inventory Management" 
            description="Manage your medicine inventory"
            action={
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
            }
          />
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search medicines..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading inventory...</div>
            </div>
          ) : filteredMedicines.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Stock</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Prescription</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedicines.map((medicine) => (
                        <tr key={medicine.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{medicine.name}</td>
                          <td className="py-3 px-4 text-sm">{medicine.category}</td>
                          <td className="py-3 px-4 text-sm">${medicine.price.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            {medicine.stock > 10 ? (
                              <Badge variant="secondary">{medicine.stock} in stock</Badge>
                            ) : medicine.stock > 0 ? (
                              <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
                                Low: {medicine.stock} left
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Out of stock</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {medicine.requires_prescription ? "Required" : "Not Required"}
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditClick(medicine)}
                            >
                              <PencilLine className="w-4 h-4 mr-1" />
                              Update Stock
                            </Button>
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
                <p className="text-gray-500 mb-4">No medicines found matching your search criteria.</p>
                <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              </CardContent>
            </Card>
          )}
          
          {/* Edit Stock Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Stock</DialogTitle>
                <DialogDescription>
                  Update the stock quantity for {selectedMedicine?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    value={selectedMedicine?.stock || 0}
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newStock">New Stock</Label>
                  <Input
                    id="newStock"
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSubmit}>Update Stock</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Add Medicine Dialog */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogDescription>
                  Enter the details of the new medicine to add to your inventory
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name*</Label>
                  <Input
                    id="name"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Input
                    id="category"
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)*</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage*</Label>
                  <Input
                    id="dosage"
                    value={addForm.dosage}
                    onChange={(e) => setAddForm({ ...addForm, dosage: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Initial Stock*</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={addForm.stock}
                    onChange={(e) => setAddForm({ ...addForm, stock: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires_prescription"
                      checked={addForm.requires_prescription}
                      onCheckedChange={(checked) => setAddForm({ ...addForm, requires_prescription: checked })}
                    />
                    <Label htmlFor="requires_prescription">Requires Prescription</Label>
                  </div>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="usage">Usage Instructions*</Label>
                  <Textarea
                    id="usage"
                    value={addForm.usage}
                    onChange={(e) => setAddForm({ ...addForm, usage: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="benefits">Benefits (comma separated)*</Label>
                  <Textarea
                    id="benefits"
                    value={addForm.benefits}
                    onChange={(e) => setAddForm({ ...addForm, benefits: e.target.value })}
                    placeholder="Reduces inflammation, Relieves pain, etc."
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sideEffects">Side Effects (comma separated)*</Label>
                  <Textarea
                    id="sideEffects"
                    value={addForm.sideEffects}
                    onChange={(e) => setAddForm({ ...addForm, sideEffects: e.target.value })}
                    placeholder="Nausea, Dizziness, etc."
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddSubmit}>Add Medicine</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InventoryManagement;
