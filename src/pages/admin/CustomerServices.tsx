import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Sample customer data (this would come from an API in a real app)
const customers = [
  { id: 1, name: "ICICI Bank", logo: "/placeholder.svg", password: "12345678", quarters: [false, false, false, false] },
  { id: 2, name: "Federal Bank", logo: "/placeholder.svg", password: "12345678", quarters: [true, false, false, false] },
  { id: 3, name: "Indusind Bank", logo: "/placeholder.svg", password: "12345678", quarters: [true, true, false, false] },
  { id: 4, name: "Caratlane", logo: "/placeholder.svg", password: "12345678", quarters: [false, false, false, false] },
];

// Sample data for breakdown services
const breakdownServicesData = {
  1: [
    { id: 1, date: "2024-04-15", fileName: "ICICI_breakdown_1.pdf", uploadDate: "2024-04-16" },
    { id: 2, date: "2024-03-22", fileName: "ICICI_breakdown_2.pdf", uploadDate: "2024-03-23" }
  ],
  2: [
    { id: 1, date: "2024-04-10", fileName: "Federal_breakdown_1.pdf", uploadDate: "2024-04-11" }
  ],
  3: [],
  4: [
    { id: 1, date: "2024-02-05", fileName: "Caratlane_breakdown_1.pdf", uploadDate: "2024-02-06" },
    { id: 2, date: "2024-01-18", fileName: "Caratlane_breakdown_2.pdf", uploadDate: "2024-01-19" },
    { id: 3, date: "2023-12-03", fileName: "Caratlane_breakdown_3.pdf", uploadDate: "2023-12-04" }
  ]
};

interface Service {
  id: number;
  date: string;
  fileName: string;
  uploadDate: string;
}

const CustomerServices = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [breakdownServices, setBreakdownServices] = useState<Service[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingTab, setUploadingTab] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [serviceDate, setServiceDate] = useState("");

  useEffect(() => {
    if (customerId) {
      const customerData = customers.find(c => c.id.toString() === customerId);
      if (customerData) {
        setCustomer(customerData);
        // Get breakdown services for this customer
        setBreakdownServices(breakdownServicesData[customerData.id as keyof typeof breakdownServicesData] || []);
      } else {
        // Customer not found, redirect back to customers list
        navigate("/admin/amc-customers");
        toast({
          title: "Customer not found",
          description: "The requested customer could not be found",
          variant: "destructive"
        });
      }
    }
  }, [customerId, navigate]);

  const handleQuarterClick = (index: number) => {
    setSelectedQuarter(index);
  };

  const handleBackToQuarters = () => {
    setSelectedQuarter(null);
  };

  const handleBackToCustomers = () => {
    navigate("/admin/amc-customers");
  };

  const handleUploadDialogOpen = (tab: string) => {
    setUploadingTab(tab);
    setShowUploadDialog(true);
    setServiceDate(new Date().toISOString().split('T')[0]); // Set to current date
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadDialog(false);
      
      if (uploadingTab === "breakdown") {
        // Add a new breakdown service to the list
        const newService = {
          id: breakdownServices.length + 1,
          date: serviceDate,
          fileName: `${customer.name.replace(/\s+/g, "_")}_breakdown_${breakdownServices.length + 1}.pdf`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        setBreakdownServices([newService, ...breakdownServices]);
        
        toast({
          title: "Breakdown service uploaded",
          description: "The service job sheet has been uploaded successfully"
        });
      } else if (uploadingTab === "quarterly" && selectedQuarter !== null) {
        // Mark quarterly service as completed
        if (customer) {
          const updatedQuarters = [...customer.quarters];
          updatedQuarters[selectedQuarter] = true;
          
          setCustomer({
            ...customer,
            quarters: updatedQuarters
          });
          
          toast({
            title: "Quarterly service uploaded",
            description: `Quarter ${selectedQuarter + 1} service job sheet has been uploaded successfully`
          });
        }
      }
    }, 1500);
  };

  const markQuarterAsCompleted = () => {
    if (customer && selectedQuarter !== null) {
      const updatedQuarters = [...customer.quarters];
      updatedQuarters[selectedQuarter] = true;
      
      setCustomer({
        ...customer,
        quarters: updatedQuarters
      });
      
      toast({
        title: "Quarter marked as completed",
        description: `Quarter ${selectedQuarter + 1} has been marked as completed for ${customer.name}`
      });
    }
  };

  if (!customer) {
    return <div className="p-8 text-center">Loading customer details...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={handleBackToCustomers}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
        
        <h1 className="text-2xl font-bold tracking-tight">{customer.name} - Services</h1>
        <p className="text-muted-foreground">Manage breakdown and quarterly services for this customer</p>
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
                  {customer.quarters.map((isCompleted: boolean, index: number) => (
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
                  <CardTitle>{customer.name} - Quarter {selectedQuarter + 1}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={markQuarterAsCompleted}
                    disabled={customer.quarters[selectedQuarter]}
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
                {customer.quarters[selectedQuarter] ? (
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

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {uploadingTab === "breakdown" 
                ? "Upload Breakdown Service" 
                : `Upload Quarter ${selectedQuarter !== null ? selectedQuarter + 1 : ""} Service`}
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

// Component for the service date input
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

export default CustomerServices;
