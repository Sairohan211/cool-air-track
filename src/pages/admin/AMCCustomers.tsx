
import { useState } from "react";
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
import { PlusCircle, Edit, MoreVertical, Upload, Check } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

// Sample customer data
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
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showQuarters, setShowQuarters] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowQuarters(true);
    setSelectedQuarter(null);
  };

  const handleQuarterClick = (index: number) => {
    setSelectedQuarter(index);
  };

  const handleMarkAsCompleted = () => {
    if (selectedCustomer && selectedQuarter !== null) {
      const updatedCustomers = customers.map(customer => {
        if (customer.id === selectedCustomer.id) {
          const updatedQuarters = [...customer.quarters];
          updatedQuarters[selectedQuarter] = true;
          return { ...customer, quarters: updatedQuarters };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
      setSelectedCustomer(prevCustomer => {
        if (prevCustomer) {
          const updatedQuarters = [...prevCustomer.quarters];
          updatedQuarters[selectedQuarter] = true;
          return { ...prevCustomer, quarters: updatedQuarters };
        }
        return null;
      });
      
      toast({
        title: "Quarter marked as completed",
        description: `Quarter ${selectedQuarter + 1} has been marked as completed for ${selectedCustomer.name}`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "File uploaded successfully",
          description: "The service job sheet has been uploaded",
        });
      }, 1500);
    }
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
          // If we had actual file upload functionality, we would handle the logo update here
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
      logo: "/placeholder.svg", // Default logo
      password: "12345678", // Default password
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

  // Renders the main customer list
  const renderCustomerList = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {customers.map((customer) => (
        <Card key={customer.id} className="overflow-hidden">
          <CardHeader className="relative p-4 pb-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => startEdit(customer)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CardTitle className="text-xl">{customer.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="mb-4 flex justify-center">
              <img 
                src={customer.logo} 
                alt={`${customer.name} logo`} 
                className="h-24 w-auto object-contain" 
              />
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleCustomerClick(customer)}
            >
              View Quarters
            </Button>
          </CardContent>
        </Card>
      ))}
      
      <Card className="flex h-full flex-col items-center justify-center p-6">
        <Button 
          variant="outline" 
          className="h-24 w-full border-dashed"
          onClick={() => setAddingNew(true)}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Customer
        </Button>
      </Card>
    </div>
  );

  // Renders the quarters for a selected customer
  const renderQuarters = () => (
    <>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => setShowQuarters(false)}
      >
        ← Back to Customers
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{selectedCustomer?.name} - Quarterly Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {selectedCustomer?.quarters.map((isCompleted, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer ${isCompleted ? 'border-green-500' : ''}`}
                onClick={() => handleQuarterClick(index)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">Quarter {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className={`text-sm font-medium ${isCompleted ? 'text-green-500' : 'text-blue-500'}`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Renders the selected quarter details
  const renderQuarterDetails = () => (
    <>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={() => setSelectedQuarter(null)}
      >
        ← Back to Quarters
      </Button>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{selectedCustomer?.name} - Quarter {selectedQuarter !== null ? selectedQuarter + 1 : ''}</CardTitle>
            <p className="text-sm text-muted-foreground">Upload service job sheet image/PDF</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleMarkAsCompleted}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF or image (max. 10MB)</p>
            <Button 
              variant="secondary" 
              className="mt-4" 
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload File"}
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );

  // Edit Customer Dialog
  const renderEditCustomerDialog = () => (
    <Dialog open={!!editCustomer} onOpenChange={(open) => !open && setEditCustomer(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Make changes to the customer's information.
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
            <Label htmlFor="password">Confirm Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }} 
              placeholder="Enter password to confirm changes"
              className={passwordError ? "border-red-500" : ""}
            />
            {passwordError && (
              <p className="text-sm text-red-500">Incorrect password</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
          <Button onClick={handleEditCustomer}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Add New Customer Dialog
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">AMC Customers</h1>
        <p className="text-muted-foreground">Manage your AMC customers and quarterly reports.</p>
      </div>

      {!showQuarters && !selectedQuarter && renderCustomerList()}
      {showQuarters && selectedCustomer && selectedQuarter === null && renderQuarters()}
      {showQuarters && selectedCustomer && selectedQuarter !== null && renderQuarterDetails()}
      
      {renderEditCustomerDialog()}
      {renderAddCustomerDialog()}
    </div>
  );
};

export default AdminAMCCustomers;
