import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Search, UserCheck, FileText, Calendar, MoreHorizontal, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Mock data for technicians
const technicians = [
  { 
    id: "T001", 
    name: "John Doe", 
    phone: "+91 98765 43210", 
    email: "john.doe@example.com",
    status: "active",
    servicesThisMonth: 28,
    attendanceRate: 98,
    lastActive: "2023-04-15T10:30:00"
  },
  { 
    id: "T002", 
    name: "Jane Smith", 
    phone: "+91 98765 12345", 
    email: "jane.smith@example.com",
    status: "active",
    servicesThisMonth: 32,
    attendanceRate: 100,
    lastActive: "2023-04-15T09:15:00"
  },
  { 
    id: "T003", 
    name: "Mike Johnson", 
    phone: "+91 87654 32109", 
    email: "mike.johnson@example.com",
    status: "inactive",
    servicesThisMonth: 0,
    attendanceRate: 75,
    lastActive: "2023-04-10T14:22:00"
  },
  { 
    id: "T004", 
    name: "Sarah Williams", 
    phone: "+91 76543 21098", 
    email: "sarah.williams@example.com",
    status: "active",
    servicesThisMonth: 24,
    attendanceRate: 95,
    lastActive: "2023-04-15T11:45:00"
  },
  { 
    id: "T005", 
    name: "David Brown", 
    phone: "+91 65432 10987", 
    email: "david.brown@example.com",
    status: "active",
    servicesThisMonth: 22,
    attendanceRate: 90,
    lastActive: "2023-04-15T08:30:00"
  }
];

// Mock data for recent activities
const recentActivities = [
  { 
    id: 1, 
    technicianId: "T001",
    technicianName: "John Doe",
    type: "service", 
    details: "Completed AC servicing at Lifestyle - Hyderabad Central",
    timestamp: "2023-04-15T10:30:00"
  },
  { 
    id: 2,
    technicianId: "T002",
    technicianName: "Jane Smith",
    type: "attendance", 
    details: "Marked attendance for today",
    timestamp: "2023-04-15T09:15:00"
  },
  { 
    id: 3,
    technicianId: "T004",
    technicianName: "Sarah Williams",
    type: "service", 
    details: "Completed AC repair at Max - Hitech City",
    timestamp: "2023-04-15T11:45:00"
  },
  { 
    id: 4,
    technicianId: "T005",
    technicianName: "David Brown",
    type: "attendance", 
    details: "Marked attendance for today",
    timestamp: "2023-04-15T08:30:00"
  },
  { 
    id: 5,
    technicianId: "T001",
    technicianName: "John Doe",
    type: "attendance", 
    details: "Marked attendance for today",
    timestamp: "2023-04-15T08:45:00"
  }
];

const AdminTechnicians = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      techId: "",
      passcode: ""
    }
  });

  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || tech.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const technicianActivities = (techId: string) => {
    return recentActivities.filter(activity => activity.technicianId === techId);
  };

  const onSubmit = (data: any) => {
    console.log("New technician data:", data);
    
    if (!data.techId) {
      data.techId = `T${String(technicians.length + 1).padStart(3, '0')}`;
    }
    
    toast({
      title: "Success!",
      description: `Technician ${data.name} added with ID: ${data.techId}`,
    });
    
    form.reset();
    setIsDialogOpen(false);
  };

  const generateRandomPasscode = () => {
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    form.setValue("passcode", passcode);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
        <p className="text-muted-foreground">
          Manage technicians and view their activities
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Technicians</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search technicians..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Technician
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Technician</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new technician. They'll receive login credentials via email.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Email Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="techId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technician ID (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. T001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="passcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Passcode</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="6-digit code"
                                  {...field}
                                />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={generateRandomPasscode}
                                size="sm"
                              >
                                Generate
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Add Technician</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Services</TableHead>
                    <TableHead className="text-right">Attendance</TableHead>
                    <TableHead className="text-right">Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTechnicians.map(tech => (
                    <TableRow key={tech.id}>
                      <TableCell className="font-medium">{tech.id}</TableCell>
                      <TableCell>{tech.name}</TableCell>
                      <TableCell>
                        <div>{tech.phone}</div>
                        <div className="text-xs text-muted-foreground">{tech.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tech.status === "active" ? "default" : "secondary"}>
                          {tech.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{tech.servicesThisMonth}</TableCell>
                      <TableCell className="text-right">{tech.attendanceRate}%</TableCell>
                      <TableCell className="text-right">{formatDate(tech.lastActive)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DialogTrigger asChild>
                                <DropdownMenuItem onClick={() => setSelectedTechnician(tech)}>
                                  View Details
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>
                                {tech.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Technician Details</DialogTitle>
                              <DialogDescription>
                                Detailed information and recent activities
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedTechnician && (
                              <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                  <div className="bg-muted rounded-lg p-4 mb-4">
                                    <div className="flex justify-between mb-2">
                                      <h3 className="font-semibold text-lg">{selectedTechnician.name}</h3>
                                      <Badge variant={selectedTechnician.status === "active" ? "default" : "secondary"}>
                                        {selectedTechnician.status === "active" ? "Active" : "Inactive"}
                                      </Badge>
                                    </div>
                                    <div className="text-sm space-y-2">
                                      <div>ID: {selectedTechnician.id}</div>
                                      <div>Email: {selectedTechnician.email}</div>
                                      <div>Phone: {selectedTechnician.phone}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                      <CardHeader className="py-2">
                                        <CardTitle className="text-sm flex items-center">
                                          <FileText className="mr-1 h-3 w-3" />
                                          Services
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-2">
                                        <div className="text-xl font-bold">{selectedTechnician.servicesThisMonth}</div>
                                        <p className="text-xs text-muted-foreground">This month</p>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="py-2">
                                        <CardTitle className="text-sm flex items-center">
                                          <UserCheck className="mr-1 h-3 w-3" />
                                          Attendance
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-2">
                                        <div className="text-xl font-bold">{selectedTechnician.attendanceRate}%</div>
                                        <p className="text-xs text-muted-foreground">Avg. rate</p>
                                      </CardContent>
                                    </Card>
                                    
                                    <Card>
                                      <CardHeader className="py-2">
                                        <CardTitle className="text-sm flex items-center">
                                          <Calendar className="mr-1 h-3 w-3" />
                                          Last Active
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent className="py-2">
                                        <div className="text-sm font-bold">{formatDate(selectedTechnician.lastActive)}</div>
                                        <p className="text-xs text-muted-foreground">Last seen</p>
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="font-semibold mb-3">Recent Activities</h3>
                                  <div className="space-y-3">
                                    {technicianActivities(selectedTechnician.id).length > 0 ? (
                                      technicianActivities(selectedTechnician.id).map(activity => (
                                        <div key={activity.id} className="flex items-start">
                                          <div className="mr-3 rounded-full p-1.5 bg-primary/10">
                                            {activity.type === "service" ? (
                                              <FileText className="h-4 w-4 text-primary" />
                                            ) : (
                                              <UserCheck className="h-4 w-4 text-primary" />
                                            )}
                                          </div>
                                          <div className="flex-1 space-y-1">
                                            <p className="text-sm leading-tight">
                                              {activity.details}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {formatDate(activity.timestamp)}
                                            </p>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-4 text-sm text-muted-foreground">
                                        No recent activities found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <DialogFooter>
                              <Button variant="outline">Reset Password</Button>
                              <Button>Edit Technician</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredTechnicians.length === 0 && (
                <div className="flex flex-col items-center justify-center h-60">
                  <AlertCircle className="h-10 w-10 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium">No technicians found</h3>
                  <p className="text-sm text-muted-foreground">
                    No technicians match your current search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">Active Technicians View</h3>
              <p className="text-sm text-muted-foreground">
                Showing only active technicians. Use the search and filter options above.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-0">
          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium">Inactive Technicians View</h3>
              <p className="text-sm text-muted-foreground">
                Showing only inactive technicians. Use the search and filter options above.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTechnicians;
