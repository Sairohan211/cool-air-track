import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit, MoreVertical, Upload, Trash2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const initialCustomers = [
  { id: 1, name: "ICICI Bank", logo: "/placeholder.svg", password: "12345678", quarters: [false, false, false, false] },
  { id: 2, name: "Federal Bank", logo: "/placeholder.svg", password: "12345678", quarters: [true, false, false, false] },
  { id: 3, name: "Indusind Bank", logo: "/placeholder.svg", password: "12345678", quarters: [true, true, false, false] },
  { id: 4, name: "Caratlane", logo: "/placeholder.svg", password: "12345678", quarters: [false, false, false, false] },
];

interface Customer {
  id: number;
  name: string;
  logo: string;
  password: string;
  quarters: boolean[];
}

const AdminAMCCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    navigate(`/admin/amc-customers/${customer.id}`);
  };

  const handleEditCustomer = () => {
    if (!editCustomer) return;
    
    if (password !== editCustomer.password) {
      setPasswordError(true);
      return;
    }
    
    const updatedCustomers = customers.map(customer => {
      if (customer.id === editCustomer.id) {
        return { 
          ...customer, 
          name: newCustomerName || customer.name,
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setEditCustomer(null);
    setPassword("");
    setNewCustomerName("");
    setLogoFile(null);
    setPasswordError(false);
    
    toast({
      title: "Customer updated",
      description: "Customer details have been updated successfully",
    });
  };

  const handleDeleteCustomer = () => {
    if (!deleteCustomer) return;
    
    if (password !== deleteCustomer.password) {
      setPasswordError(true);
      return;
    }
    
    const updatedCustomers = customers.filter(customer => customer.id !== deleteCustomer.id);
    setCustomers(updatedCustomers);
    setDeleteCustomer(null);
    setPassword("");
    setPasswordError(false);
    
    toast({
      title: "Customer deleted",
      description: "Customer has been deleted successfully",
    });
  };

  const handleAddCustomer = () => {
    if (!newCustomerName) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newCustomer: Customer = {
      id: customers.length + 1,
      name: newCustomerName,
      logo: "/placeholder.svg",
      password: "12345678",
      quarters: [false, false, false, false]
    };
    
    setCustomers([...customers, newCustomer]);
    setAddingNew(false);
    setNewCustomerName("");
    
    toast({
      title: "Customer added",
      description: "New customer has been added successfully",
    });
  };

  const startEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setNewCustomerName(customer.name);
    setPassword("");
    setPasswordError(false);
  };

  const renderCustomerList = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            AMC Customers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your AMC customer accounts
          </p>
        </div>
        <Button 
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Customer
        </Button>
      </div>
      
      <div className="flex flex-col space-y-4 max-w-3xl mx-auto">
        {customers.map((customer) => (
          <Card 
            key={customer.id} 
            className="w-full transition-all duration-200 hover:shadow-lg bg-card/50 backdrop-blur-sm border border-purple-800/20"
          >
            <CardHeader className="relative p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEdit(customer)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteCustomer(customer)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-secondary/30 p-1.5">
                  <img 
                    src={customer.logo} 
                    alt={`${customer.name} logo`} 
                    className="h-full w-full object-contain" 
                  />
                </div>
                <CardTitle className="text-lg font-semibold">{customer.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4 px-4">
              <Button 
                variant="secondary" 
                className="w-full hover:bg-purple-900/20"
                onClick={() => handleCustomerClick(customer)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const handleEditBranch = () => {
    if (!editCustomer) return;
    
    if (password !== editCustomer.password) {
      setPasswordError(true);
      toast({
        title: "Authentication Error",
        description: "Please enter the correct password to edit branch details",
        variant: "destructive"
      });
      return;
    }
    
    const updatedCustomers = customers.map(customer => {
      if (customer.id === editCustomer.id) {
        return { 
          ...customer, 
          name: newCustomerName || customer.name,
        };
      }
      return customer;
    });
    
    setCustomers(updatedCustomers);
    setEditCustomer(null);
    setPassword("");
    setNewCustomerName("");
    setLogoFile(null);
    setPasswordError(false);
    
    toast({
      title: "Customer updated",
      description: "Customer details have been updated successfully",
    });
  };

  const renderEditCustomerDialog = () => (
    <Dialog open={!!editCustomer} onOpenChange={(open) => !open && setEditCustomer(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer Branch</DialogTitle>
          <DialogDescription>
            Please enter your password to make changes to branch information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input 
              id="customerName" 
              value={newCustomerName} 
              onChange={(e) => setNewCustomerName(e.target.value)} 
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo (optional)</Label>
            <div className="flex items-center space-x-4">
              <img 
                src={editCustomer?.logo || "/placeholder.svg"} 
                alt="Customer logo" 
                className="h-12 w-12 rounded object-contain" 
              />
              <Button variant="outline" className="relative">
                Upload New Logo
                <input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
                />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">Enter Password to Confirm</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }} 
              placeholder="Enter your password"
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError && (
              <p className="text-sm text-red-500">Incorrect password</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
          <Button onClick={handleEditBranch}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteDialog = () => (
    <Dialog open={!!deleteCustomer} onOpenChange={(open) => !open && setDeleteCustomer(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please enter the customer password to confirm deletion.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Confirm Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }} 
              placeholder="Enter password to confirm deletion"
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError && (
              <p className="text-sm text-red-500">Incorrect password</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteCustomer(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDeleteCustomer}>Delete Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderAddCustomerDialog = () => (
    <Dialog open={addingNew} onOpenChange={setAddingNew}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter the details of the new customer.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="newCustomerName">Customer Name</Label>
            <Input 
              id="newCustomerName" 
              value={newCustomerName} 
              onChange={(e) => setNewCustomerName(e.target.value)} 
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newLogo">Logo (optional)</Label>
            <Button variant="outline" className="relative w-full">
              Upload Logo
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                accept="image/*"
                onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
              />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAddingNew(false)}>Cancel</Button>
          <Button onClick={handleAddCustomer}>Add Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {renderCustomerList()}
      {renderEditCustomerDialog()}
      {renderDeleteDialog()}
      {renderAddCustomerDialog()}
    </div>
  );
};

export default AdminAMCCustomers;
