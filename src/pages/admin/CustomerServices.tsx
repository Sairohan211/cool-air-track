
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, ArrowLeft, Folder, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

const customers = [
  {
    id: 1,
    name: "ICICI Bank",
    logo: "/placeholder.svg",
    password: "12345678",
    branches: [
      { id: 1, name: "Koramangala", quarters: [false, false, false, false] },
      { id: 2, name: "MG Road", quarters: [true, false, false, false] }
    ]
  },
  {
    id: 2,
    name: "Federal Bank",
    logo: "/placeholder.svg",
    password: "12345678",
    branches: [
      { id: 1, name: "Jayanagar", quarters: [true, false, false, false] }
    ]
  },
  {
    id: 3,
    name: "Indusind Bank",
    logo: "/placeholder.svg",
    password: "12345678",
    branches: [
      { id: 1, name: "Indiranagar", quarters: [true, true, false, false] }
    ]
  },
  {
    id: 4,
    name: "Caratlane",
    logo: "/placeholder.svg",
    password: "12345678",
    branches: [
      { id: 1, name: "Commercial Street", quarters: [false, false, false, false] }
    ]
  }
];

const breakdownServicesData = {
  1: [
    { id: 1, branchId: 1, date: "2024-04-15", fileName: "ICICI_Koramangala_breakdown_1.pdf", uploadDate: "2024-04-16" },
    { id: 2, branchId: 2, date: "2024-03-22", fileName: "ICICI_MG_Road_breakdown_1.pdf", uploadDate: "2024-03-23" }
  ],
  2: [
    { id: 1, branchId: 1, date: "2024-04-10", fileName: "Federal_Jayanagar_breakdown_1.pdf", uploadDate: "2024-04-11" }
  ],
  3: [],
  4: [
    { id: 1, branchId: 1, date: "2024-02-05", fileName: "Caratlane_Commercial_Street_breakdown_1.pdf", uploadDate: "2024-02-06" }
  ]
};

interface Branch {
  id: number;
  name: string;
  quarters: boolean[];
}

interface Service {
  id: number;
  branchId: number;
  date: string;
  fileName: string;
  uploadDate: string;
}

const CustomerServices = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [breakdownServices, setBreakdownServices] = useState<Service[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingTab, setUploadingTab] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [serviceDate, setServiceDate] = useState("");
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editBranchName, setEditBranchName] = useState("");
  const [showDeleteBranchDialog, setShowDeleteBranchDialog] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  // Load customer data
  useEffect(() => {
    if (customerId) {
      const customerData = customers.find(c => c.id.toString() === customerId);
      if (customerData) {
        setCustomer(customerData);
        setSelectedBranch(null);
      } else {
        navigate("/admin/amc-customers");
        toast({
          title: "Customer not found",
          description: "The requested customer could not be found",
          variant: "destructive"
        });
      }
    }
  }, [customerId, navigate]);

  // Load breakdown services
  useEffect(() => {
    if (!customer || !selectedBranch) {
      setBreakdownServices([]);
      return;
    }
    const allServices = breakdownServicesData[customer.id] || [];
    setBreakdownServices(allServices.filter((s: Service) => s.branchId === selectedBranch.id));
  }, [customer, selectedBranch]);

  // Add new branch
  const handleAddBranch = () => {
    if (!newBranchName) {
      toast({
        title: "Branch name required",
        description: "Please provide a branch name.",
        variant: "destructive"
      });
      return;
    }
    const newBranch: Branch = {
      id: (customer.branches.length > 0 ? Math.max(...customer.branches.map((b: any) => b.id)) + 1 : 1),
      name: newBranchName,
      quarters: [false, false, false, false]
    };
    const updated = {
      ...customer,
      branches: [...customer.branches, newBranch]
    };
    setCustomer(updated);
    setShowAddBranchDialog(false);
    setNewBranchName("");
    toast({ title: "Branch added", description: `Branch "${newBranch.name}" added.` });
  };

  // Navigation handlers
  const handleQuarterClick = (index: number) => setSelectedQuarter(index);
  const handleBackToQuarters = () => setSelectedQuarter(null);
  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setSelectedQuarter(null);
  };
  const handleBackToCustomers = () => {
    navigate("/admin/amc-customers");
  };

  // Upload handlers
  const handleUploadDialogOpen = (tab: string) => {
    setUploadingTab(tab);
    setShowUploadDialog(true);
    setServiceDate(new Date().toISOString().split('T')[0]);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadDialog(false);

      if (uploadingTab === "breakdown") {
        if (!selectedBranch || !customer) return;
        const newService = {
          id: breakdownServices.length + 1,
          branchId: selectedBranch.id,
          date: serviceDate,
          fileName: `${customer.name.replace(/\s+/g, "_")}_${selectedBranch.name.replace(/\s+/g, "_")}_breakdown_${breakdownServices.length + 1}.pdf`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setBreakdownServices([newService, ...breakdownServices]);

        toast({
          title: "Breakdown service uploaded",
          description: "The service job sheet has been uploaded successfully"
        });
      } else if (uploadingTab === "quarterly" && selectedQuarter !== null && selectedBranch && customer) {
        const updatedBranches = customer.branches.map((b: Branch) =>
          b.id === selectedBranch.id
            ? { ...b, quarters: b.quarters.map((q, idx) => idx === selectedQuarter ? true : q) }
            : b
        );
        setCustomer({
          ...customer,
          branches: updatedBranches
        });

        toast({
          title: "Quarterly service uploaded",
          description: `Quarter ${selectedQuarter + 1} service job sheet has been uploaded successfully`
        });
      }
    }, 1500);
  };

  // Mark quarter as completed
  const markQuarterAsCompleted = () => {
    if (customer && selectedBranch && selectedQuarter !== null) {
      const updatedBranches = customer.branches.map((b: Branch) =>
        b.id === selectedBranch.id
          ? { ...b, quarters: b.quarters.map((q, idx) => idx === selectedQuarter ? true : q) }
          : b
      );
      setCustomer({ ...customer, branches: updatedBranches });

      toast({
        title: "Quarter marked as completed",
        description: `Quarter ${selectedQuarter + 1} has been marked as completed for ${selectedBranch.name}`
      });
    }
  };

  // Branch edit handlers
  const handleBranchEdit = () => {
    if (!editingBranch) return;
    if (!editBranchName.trim()) {
      toast({
        title: "Branch name required",
        description: "Please provide a branch name.",
        variant: "destructive"
      });
      return;
    }
    if (customer) {
      const updatedBranches = customer.branches.map((b: Branch) =>
        b.id === editingBranch.id ? { ...b, name: editBranchName } : b
      );
      setCustomer({ ...customer, branches: updatedBranches });
    }
    setEditingBranch(null);
    setEditBranchName("");
    toast({ title: "Branch updated", description: `Branch name updated.` });
  };

  // Branch delete handler
  const handleBranchDelete = () => {
    if (customer && branchToDelete) {
      const updatedBranches = customer.branches.filter((b: Branch) => b.id !== branchToDelete.id);
      setCustomer({ ...customer, branches: updatedBranches });
      toast({ title: "Branch deleted", description: `Branch "${branchToDelete.name}" deleted.` });
    }
    setShowDeleteBranchDialog(false);
    setBranchToDelete(null);
  };

  // Dialog components
  const renderAddBranchDialog = () => (
    <Dialog open={showAddBranchDialog} onOpenChange={setShowAddBranchDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
          <DialogDescription>Enter the name of the new branch for {customer?.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              value={newBranchName}
              onChange={e => setNewBranchName(e.target.value)}
              placeholder="Enter branch name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddBranchDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBranch}>Add Branch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderEditBranchDialog = () => (
    <Dialog open={!!editingBranch} onOpenChange={(open) => !open && setEditingBranch(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
          <DialogDescription>Update the branch name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="editBranchName">Branch Name</Label>
            <Input
              id="editBranchName"
              value={editBranchName}
              onChange={e => setEditBranchName(e.target.value)}
              placeholder="Enter branch name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEditingBranch(null)}>Cancel</Button>
          <Button onClick={handleBranchEdit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderDeleteBranchDialog = () => (
    <Dialog open={showDeleteBranchDialog} onOpenChange={setShowDeleteBranchDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Branch?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{branchToDelete?.name}</span>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteBranchDialog(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleBranchDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Branch list view
  const renderBranchesView = () => (
    <div className="container mx-auto p-4 md:p-6">
      <Button
        variant="outline"
        className="mb-4"
        onClick={handleBackToCustomers}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Customers
      </Button>

      <h1 className="text-2xl font-bold tracking-tight mb-3">
        {customer?.name} - Branches
      </h1>
      <p className="text-muted-foreground mb-5">Select a branch to manage its services.</p>

      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button onClick={() => setShowAddBranchDialog(true)} className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Branch
        </Button>
      </div>

      {customer?.branches && customer.branches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {customer.branches.map((branch: Branch) => (
            <Card
              key={branch.id}
              className="relative cursor-pointer hover:border-primary transition-colors"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest(".branch-dropdown-trigger")) {
                  setSelectedBranch(branch);
                  setSelectedQuarter(null);
                }
              }}
            >
              <CardHeader className="p-4 pb-2 flex-row flex items-center gap-4">
                <Folder className="h-6 w-6 mr-2 text-primary" />
                <CardTitle className="text-lg">{branch.name}</CardTitle>
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="branch-dropdown-trigger"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          setEditingBranch(branch);
                          setEditBranchName(branch.name);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          setShowDeleteBranchDialog(true);
                          setBranchToDelete(branch);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm text-muted-foreground">
                  {branch.quarters.filter(Boolean).length} / 4 quarters completed
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center text-muted-foreground">No branches added yet.</div>
      )}

      {renderAddBranchDialog()}
      {renderEditBranchDialog()}
      {renderDeleteBranchDialog()}
    </div>
  );

  // Branch services view (breakdown & quarterly)
  const renderBranchServicesView = () => {
    if (!selectedBranch) return null;

    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Button variant="outline" className="mb-4" onClick={handleBackToBranches}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Branches
          </Button>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {customer.name} - {selectedBranch.name} Services
          </h1>
          <p className="text-muted-foreground">
            Manage breakdown and quarterly services for this branch
          </p>
        </div>

        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="breakdown">Breakdown Services</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly Services</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Breakdown Services</CardTitle>
                <Button onClick={() => handleUploadDialogOpen("breakdown")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Service
                </Button>
              </CardHeader>
              <CardContent>
                {breakdownServices.length > 0 ? (
                  <div className="space-y-4">
                    {breakdownServices.map((service) => (
                      <Card key={service.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 mr-4 text-primary" />
                            <div>
                              <h4 className="text-sm font-medium">{service.fileName}</h4>
                              <div className="flex space-x-4 text-xs text-muted-foreground">
                                <span>Service Date: {service.date}</span>
                                <span>Uploaded: {service.uploadDate}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No breakdown services recorded yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => handleUploadDialogOpen("breakdown")}
                    >
                      Upload First Service Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quarterly">
            {selectedQuarter === null ? (
              <Card>
                <CardHeader>
                  <CardTitle>Quarterly Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {selectedBranch.quarters.map((isCompleted: boolean, index: number) => (
                      <Card
                        key={index}
                        className={`cursor-pointer hover:border-primary transition-colors ${isCompleted ? 'border-green-500' : ''}`}
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
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <Button
                      variant="outline"
                      className="mb-4"
                      onClick={handleBackToQuarters}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Quarters
                    </Button>
                    <CardTitle>{customer.name} - {selectedBranch.name} - Quarter {selectedQuarter + 1}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={markQuarterAsCompleted}
                      disabled={selectedBranch.quarters[selectedQuarter]}
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      onClick={() => handleUploadDialogOpen("quarterly")}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Service Sheet
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedBranch.quarters[selectedQuarter] ? (
                    <div className="p-8 text-center">
                      <div className="bg-green-50 text-green-700 p-4 rounded-lg inline-flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 10L9 11.5L12.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span>Quarterly service has been completed</span>
                      </div>
                      <p className="text-muted-foreground">
                        This quarterly service has been marked as completed. You can view the details or upload a new service sheet if needed.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
                      <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                      <p className="mb-2 text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF or image (max. 10MB)</p>
                      <Button
                        variant="secondary"
                        className="mt-4"
                        onClick={() => handleUploadDialogOpen("quarterly")}
                      >
                        Upload File
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {uploadingTab === "breakdown"
                  ? `Upload Breakdown Service for ${selectedBranch.name}`
                  : `Upload Quarter ${selectedQuarter !== null ? selectedQuarter + 1 : ""} (${selectedBranch.name}) Service`}
              </DialogTitle>
              <DialogDescription>
                Upload the service job sheet for this {uploadingTab === "breakdown" ? "breakdown service" : "quarterly service"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceDate">Service Date</Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6">
                <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">Click to select a file or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF or image (max. 10MB)</p>
                <Button
                  variant="outline"
                  className="mt-4 relative"
                >
                  Select File
                  <input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept=".pdf,image/*"
                  />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
              <Button
                onClick={handleFileUpload}
                disabled={isUploading || !serviceDate}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Determine which view to render
  if (!customer) {
    return <div className="p-8 text-center">Loading customer details...</div>;
  }

  if (!selectedBranch) {
    return renderBranchesView();
  }

  return renderBranchServicesView();
};

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

export default CustomerServices;
