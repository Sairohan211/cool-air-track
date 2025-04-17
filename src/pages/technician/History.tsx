
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, CalendarDays, Search, ChevronDown, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data for service history
const serviceHistory = [
  {
    id: 1,
    date: "2023-04-15",
    store: "Lifestyle",
    branch: "Hyderabad Central",
    type: "Installation",
    description: "Installed new 1.5 ton split AC in manager's office",
    imageUrl: "https://images.unsplash.com/photo-1621189288738-de2673dba590"
  },
  {
    id: 2,
    date: "2023-04-14",
    store: "Max",
    branch: "Hitech City",
    type: "Servicing",
    description: "Regular maintenance and cleaning of 3 AC units in main hall",
    imageUrl: "https://images.unsplash.com/photo-1605146768851-eda79da39897"
  },
  {
    id: 3,
    date: "2023-04-12",
    store: "Easy",
    branch: "Ameerpet",
    type: "Repair",
    description: "Fixed refrigerant leak in display area AC unit",
    imageUrl: "https://images.unsplash.com/photo-1504198453335-db8d87a95f27"
  },
  {
    id: 4,
    date: "2023-04-10",
    store: "Lifestyle",
    branch: "Secundrabad",
    type: "Maintenance",
    description: "Quarterly maintenance of all AC units in store",
    imageUrl: "https://images.unsplash.com/photo-1560178783-8fcaaa7297ab"
  },
  {
    id: 5,
    date: "2023-04-08",
    store: "Max",
    branch: "Banjara Hills",
    type: "Installation",
    description: "Installed new 2 ton AC in trial room area",
    imageUrl: "https://images.unsplash.com/photo-1546435770-a3e5a7e3f4de"
  }
];

// Mock data for attendance history
const attendanceHistory = [
  {
    id: 1,
    date: "2023-04-15",
    checkInTime: "09:05 AM",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 2,
    date: "2023-04-14",
    checkInTime: "08:58 AM",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    id: 3,
    date: "2023-04-12",
    checkInTime: "09:12 AM",
    photoUrl: "https://images.unsplash.com/photo-1654110455429-cf322b40a906"
  },
  {
    id: 4,
    date: "2023-04-10",
    checkInTime: "08:45 AM",
    photoUrl: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218"
  },
  {
    id: 5,
    date: "2023-04-08",
    checkInTime: "09:01 AM",
    photoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39"
  }
];

const TechnicianHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);

  // Filter services based on search and month
  const filteredServices = serviceHistory.filter(service => {
    const matchesSearch = service.store.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If "all" is selected or the service date is in the selected month
    const matchesMonth = selectedMonth === "all" || (new Date(service.date).getMonth() + 1).toString() === selectedMonth;
    
    return matchesSearch && matchesMonth;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity History</h1>
        <p className="text-muted-foreground">
          View your past services and attendance records
        </p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="services">
            <FileText className="mr-2 h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <CalendarDays className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
              <CardDescription>
                Records of all your completed services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="w-full sm:w-[180px]">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="1">January</SelectItem>
                      <SelectItem value="2">February</SelectItem>
                      <SelectItem value="3">March</SelectItem>
                      <SelectItem value="4">April</SelectItem>
                      <SelectItem value="5">May</SelectItem>
                      <SelectItem value="6">June</SelectItem>
                      <SelectItem value="7">July</SelectItem>
                      <SelectItem value="8">August</SelectItem>
                      <SelectItem value="9">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredServices.length > 0 ? (
                  filteredServices.map(service => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <img 
                            src={`${service.imageUrl}?w=300&h=200&fit=crop&auto=format`} 
                            alt="Service receipt" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 md:w-2/3">
                          <div className="flex justify-between mb-2">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(service.date)}
                            </div>
                            <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                              {service.type}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold mb-1">
                            {service.store} - {service.branch}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {service.description}
                          </p>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedService(service)}
                                >
                                  <Image className="mr-2 h-4 w-4" />
                                  View Receipt
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Service Receipt</DialogTitle>
                                  <DialogDescription>
                                    {selectedService?.store} - {selectedService?.branch} ({formatDate(selectedService?.date || '')})
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedService && (
                                  <div className="overflow-hidden rounded-md">
                                    <img 
                                      src={`${selectedService.imageUrl}?w=800&h=600&fit=crop&auto=format`} 
                                      alt="Service receipt" 
                                      className="w-full object-contain max-h-[70vh]"
                                    />
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <h3 className="mt-4 text-lg font-medium">No services found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No service records match your current filters.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Record of your daily check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendanceHistory.map(record => (
                  <Card key={record.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={`${record.photoUrl}?w=300&h=300&fit=crop&auto=format`} 
                        alt="Attendance photo" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 text-white">
                        <div className="font-medium">{formatDate(record.date)}</div>
                        <div className="text-sm opacity-80">Check in: {record.checkInTime}</div>
                      </div>
                    </div>
                    <div className="p-3 flex justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedAttendance(record)}
                          >
                            <Image className="mr-2 h-4 w-4" />
                            View Full Image
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Attendance Photo</DialogTitle>
                            <DialogDescription>
                              {formatDate(selectedAttendance?.date || '')} - {selectedAttendance?.checkInTime}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedAttendance && (
                            <div className="overflow-hidden rounded-md">
                              <img 
                                src={`${selectedAttendance.photoUrl}?w=800&h=800&fit=crop&auto=format`} 
                                alt="Attendance photo" 
                                className="w-full object-contain max-h-[70vh]"
                              />
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianHistory;
