
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Camera, UploadCloud, FileText, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Mock data for stores and branches
const stores = [
  { id: 1, name: "Lifestyle" },
  { id: 2, name: "Max" },
  { id: 3, name: "Easy" }
];

const branches = {
  1: [
    { id: 101, name: "Hyderabad Central" },
    { id: 102, name: "Secundrabad" },
    { id: 103, name: "Kukatpally" }
  ],
  2: [
    { id: 201, name: "Hitech City" },
    { id: 202, name: "Banjara Hills" },
    { id: 203, name: "ECIL" }
  ],
  3: [
    { id: 301, name: "Ameerpet" },
    { id: 302, name: "Dilsukhnagar" },
    { id: 303, name: "Gachibowli" }
  ]
};

// Service types
const serviceTypes = [
  { id: 1, name: "Installation" },
  { id: 2, name: "Servicing" },
  { id: 3, name: "Repair" },
  { id: 4, name: "Maintenance" }
];

const TechnicianService = () => {
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetForm = () => {
    setSelectedStore("");
    setSelectedBranch("");
    setServiceType("");
    setDescription("");
    setReceiptImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStore || !selectedBranch || !serviceType || !description || !receiptImage) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and attach a receipt photo.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Service Recorded",
        description: "Your service record has been submitted successfully.",
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Service Submission</h1>
        <p className="text-muted-foreground">
          Submit service details and attach receipt
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2" />
              Service Record
            </CardTitle>
            <CardDescription>
              Fill in the details for the service you've completed
            </CardDescription>
          </CardHeader>
          
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-600">Service Submitted</h3>
                <p className="text-gray-500 mt-2">Your service record has been submitted successfully</p>
                
                <Button 
                  className="mt-6"
                  onClick={() => {
                    resetForm();
                    setIsSubmitted(false);
                  }}
                >
                  Submit Another
                </Button>
              </div>
            </CardContent>
          ) : (
            <>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="store">Store</Label>
                    <Select 
                      value={selectedStore} 
                      onValueChange={(value) => {
                        setSelectedStore(value);
                        setSelectedBranch(""); // Reset branch when store changes
                      }}
                    >
                      <SelectTrigger id="store">
                        <SelectValue placeholder="Select Store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map(store => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select 
                      value={selectedBranch} 
                      onValueChange={setSelectedBranch}
                      disabled={!selectedStore}
                    >
                      <SelectTrigger id="branch">
                        <SelectValue placeholder={selectedStore ? "Select Branch" : "Select Store First"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedStore && branches[parseInt(selectedStore) as keyof typeof branches]?.map(branch => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Describe the service performed..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Receipt Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    {receiptImage ? (
                      <div className="relative aspect-video">
                        <img 
                          src={receiptImage} 
                          alt="Receipt" 
                          className="rounded-md w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setReceiptImage(null)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="flex flex-col items-center justify-center py-6 cursor-pointer"
                        onClick={triggerFileUpload}
                      >
                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          <span className="font-medium text-primary">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG or JPEG (max. 5MB)
                        </p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={(el) => fileInputRef.current = el}
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Service Record"}
                </Button>
              </CardFooter>
            </>
          )}
        </form>
      </Card>
    </div>
  );
};

export default TechnicianService;
