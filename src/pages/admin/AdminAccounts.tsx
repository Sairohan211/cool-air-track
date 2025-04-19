
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { UserPlus, User, Edit, Trash, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sample data for employees
const initialEmployees = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", password: "password123" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "technician", password: "password123" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "technician", password: "password123" },
];

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

const AdminAccounts = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "technician",
    password: "",
    confirmPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "technician",
      password: "",
      confirmPassword: ""
    });
    
    setFormErrors({
      name: false,
      email: false,
      password: false,
      confirmPassword: false
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const openAddEmployeeDialog = () => {
    resetForm();
    setIsAddingEmployee(true);
  };

  const openEditEmployeeDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      password: "",
      confirmPassword: ""
    });
    setIsEditingEmployee(true);
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name.trim(),
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      password: isAddingEmployee && formData.password.length < 6,
      confirmPassword: isAddingEmployee && formData.password !== formData.confirmPassword
    };
    
    setFormErrors(errors);
    
    return !Object.values(errors).some(error => error);
  };

  const handleAddEmployee = () => {
    if (!validateForm()) return;
    
    const newEmployee: Employee = {
      id: employees.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password
    };
    
    setEmployees([...employees, newEmployee]);
    setIsAddingEmployee(false);
    resetForm();
    
    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been added as a ${newEmployee.role}`,
    });
  };

  const handleEditEmployee = () => {
    if (!currentEmployee) return;
    
    // Simplified validation for edit (no password required)
    if (!formData.name.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setFormErrors({
        ...formErrors,
        name: !formData.name.trim(),
        email: !/^\S+@\S+\.\S+$/.test(formData.email)
      });
      return;
    }
    
    const updatedEmployees = employees.map(emp => {
      if (emp.id === currentEmployee.id) {
        return {
          ...emp,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password && { password: formData.password })
        };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    setIsEditingEmployee(false);
    setCurrentEmployee(null);
    resetForm();
    
    toast({
      title: "Employee Updated",
      description: `${formData.name}'s information has been updated`,
    });
  };

  const handleDeleteEmployee = (employee: Employee) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employee.id);
    setEmployees(updatedEmployees);
    
    toast({
      title: "Employee Removed",
      description: `${employee.name} has been removed from the system`,
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Accounts</h1>
          <p className="text-muted-foreground">Manage admin and technician accounts</p>
        </div>
        <Button onClick={openAddEmployeeDialog} className="flex items-center gap-2">
          <UserPlus size={16} />
          Add Employee
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {employees.map(employee => (
          <Card key={employee.id}>
            <CardHeader className="relative pb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditEmployeeDialog(employee)}>
                    <Edit size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteEmployee(employee)} className="text-red-600">
                    <Trash size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <User size={20} className="text-primary" />
                </div>
                <CardTitle>{employee.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{employee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="capitalize">{employee.role}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add Employee Dialog */}
      <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Create a new employee account. They'll be able to log in using these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-sm text-red-500">Name is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-sm text-red-500">Valid email is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password} 
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && <p className="text-sm text-red-500">Password must be at least 6 characters</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={formErrors.confirmPassword ? "border-red-500" : ""}
              />
              {formErrors.confirmPassword && <p className="text-sm text-red-500">Passwords do not match</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingEmployee(false)}>Cancel</Button>
            <Button onClick={handleAddEmployee}>Create Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditingEmployee} onOpenChange={setIsEditingEmployee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name} 
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && <p className="text-sm text-red-500">Name is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && <p className="text-sm text-red-500">Valid email is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (optional)</Label>
              <Input 
                id="edit-password" 
                type="password" 
                value={formData.password} 
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Leave blank to keep the current password</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingEmployee(false)}>Cancel</Button>
            <Button onClick={handleEditEmployee}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAccounts;
