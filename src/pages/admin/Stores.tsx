import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Store, MapPin, MoreHorizontal, Plus, UserPlus, Phone } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const stores = [
  { 
    id: 1, 
    name: "Lifestyle", 
    type: "Franchise",
    logo: "https://raw.githubusercontent.com/dhanushkunapareddy/slv-climate-max-stores/main/assets/img/logo.png",
    phone: "+91 40 6610 1234",
    branches: [
      { 
        id: 101, 
        name: "Hyderabad Central", 
        location: "Punjagutta Road", 
        phone: "+91 40 6610 5678", 
        servicesThisMonth: 25,
        address: "Ground Floor, Sharma Complex, Punjagutta Road, Hyderabad"
      },
      { 
        id: 102, 
        name: "Secundrabad", 
        location: "MG Road", 
        phone: "+91 40 6610 8901", 
        servicesThisMonth: 18,
        address: "First Floor, Business Center, MG Road, Secunderabad"
      },
      { 
        id: 103, 
        name: "Kukatpally", 
        location: "KPHB Colony", 
        phone: "+91 40 6610 2345", 
        servicesThisMonth: 22,
        address: "Shop No. 12, KPHB Commercial Complex, Kukatpally, Hyderabad"
      }
    ]
  },
  { 
    id: 2, 
    name: "Max", 
    type: "Franchise",
    logo: "https://raw.githubusercontent.com/dhanushkunapareddy/slv-climate-max-stores/main/assets/img/logo.png",
    phone: "+91 40 6620 1234",
    branches: [
      { 
        id: 201, 
        name: "Hitech City", 
        location: "Madhapur", 
        phone: "+91 40 6620 5678", 
        servicesThisMonth: 30,
        address: "Ground Floor, Cyber Towers, Madhapur, Hyderabad"
      },
      { 
        id: 202, 
        name: "Banjara Hills", 
        location: "Road No. 12", 
        phone: "+91 40 6620 8901", 
        servicesThisMonth: 24,
        address: "First Floor, Business Plaza, Road No. 12, Banjara Hills"
      },
      { 
        id: 203, 
        name: "ECIL", 
        location: "Kushaiguda", 
        phone: "+91 40 6620 2345", 
        servicesThisMonth: 15,
        address: "Shop Complex, ECIL Main Road, Kushaiguda, Hyderabad"
      }
    ]
  },
  { 
    id: 3, 
    name: "Easybuy", 
    type: "Franchise",
    logo: "https://raw.githubusercontent.com/dhanushkunapareddy/slv-climate-easybuy-stores/main/assets/img/logo.png",
    phone: "+91 40 6630 1234",
    branches: [
      { 
        id: 301, 
        name: "Ameerpet", 
        location: "SR Nagar", 
        phone: "+91 40 6630 5678", 
        servicesThisMonth: 20,
        address: "Ground Floor, Srinivas Complex, SR Nagar, Hyderabad"
      },
      { 
        id: 302, 
        name: "Dilsukhnagar", 
        location: "Moosaram Bagh", 
        phone: "+91 40 6630 8901", 
        servicesThisMonth: 16,
        address: "First Floor, Business Center, Moosaram Bagh, Dilsukhnagar"
      },
      { 
        id: 303, 
        name: "Gachibowli", 
        location: "Financial District", 
        phone: "+91 40 6630 2345", 
        servicesThisMonth: 19,
        address: "Shop No. 15, Financial District Complex, Gachibowli"
      }
    ]
  }
];

const AdminStores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [newTechnicianData, setNewTechnicianData] = useState({
    username: "",
    password: "",
    name: "",
    storeId: "",
    branchId: ""
  });

  const allBranches = stores.flatMap(store => 
    store.branches.map(branch => ({
      ...branch,
      storeName: store.name,
      storeId: store.id
    }))
  );
  
  const filteredBranches = allBranches.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStore = storeFilter === "all" || branch.storeId.toString() === storeFilter;
    
    return matchesSearch && matchesStore;
  });
  
  const handleTechnicianCreate = () => {
    console.log("Creating technician:", newTechnicianData);
    setNewTechnicianData({
      username: "",
      password: "",
      name: "",
      storeId: "",
      branchId: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground">
            Manage store locations and technicians
          </p>
        </div>

        <Dialog>
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
                Create credentials for a new technician
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="techName" className="text-right">Name</Label>
                <Input
                  id="techName"
                  value={newTechnicianData.name}
                  onChange={(e) => setNewTechnicianData({...newTechnicianData, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input
                  id="username"
                  value={newTechnicianData.username}
                  onChange={(e) => setNewTechnicianData({...newTechnicianData, username: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newTechnicianData.password}
                  onChange={(e) => setNewTechnicianData({...newTechnicianData, password: e.target.value})}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="store" className="text-right">Store</Label>
                <Select 
                  value={newTechnicianData.storeId} 
                  onValueChange={(value) => setNewTechnicianData({...newTechnicianData, storeId: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id.toString()}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="branch" className="text-right">Branch</Label>
                <Select
                  value={newTechnicianData.branchId}
                  onValueChange={(value) => setNewTechnicianData({...newTechnicianData, branchId: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {newTechnicianData.storeId && 
                      stores
                        .find(s => s.id.toString() === newTechnicianData.storeId)
                        ?.branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleTechnicianCreate}>Create Technician</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map(store => (
              <SelectItem key={store.id} value={store.id.toString()}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-4 flex-1 md:flex-initial">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search locations..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Add a new location to an existing store franchise.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="store" className="text-right">
                    Store
                  </Label>
                  <Select>
                    <SelectTrigger id="store" className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="locationName" className="text-right">
                    Location Name
                  </Label>
                  <Input id="locationName" placeholder="Location Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input id="address" placeholder="Full Address" className="col-span-3" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Location</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location Name</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Services This Month</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.map(branch => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {branch.storeName}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell className="text-right">{branch.servicesThisMonth}</TableCell>
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
                            <DropdownMenuItem onClick={() => {
                              const store = stores.find(s => s.id === branch.storeId);
                              setSelectedStore(store);
                              setSelectedBranch(branch);
                            }}>
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Branch Details</DialogTitle>
                          <DialogDescription>
                            Detailed information about this branch
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedBranch && selectedStore && (
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <div className="bg-muted rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline">{selectedStore.name}</Badge>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{selectedBranch.name}</h3>
                                <div className="text-sm space-y-2">
                                  <div className="flex items-center text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {selectedBranch.location}
                                  </div>
                                </div>
                              </div>
                              
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">Service Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-2xl font-bold">{selectedBranch.servicesThisMonth}</div>
                                      <p className="text-xs text-muted-foreground">Services this month</p>
                                    </div>
                                    <div>
                                      <div className="text-2xl font-bold">143</div>
                                      <p className="text-xs text-muted-foreground">Total services</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div>
                              <h3 className="font-semibold mb-3">Recent Services</h3>
                              <div className="space-y-3">
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <div className="font-medium">AC Installation</div>
                                  <div className="text-sm text-muted-foreground">Apr 15, 2023 by John Doe</div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <div className="font-medium">Regular Maintenance</div>
                                  <div className="text-sm text-muted-foreground">Apr 10, 2023 by Jane Smith</div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <div className="font-medium">AC Servicing</div>
                                  <div className="text-sm text-muted-foreground">Apr 5, 2023 by Mike Johnson</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button variant="outline">Service History</Button>
                          <Button>Edit Branch</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBranches.length === 0 && (
            <div className="flex flex-col items-center justify-center h-60">
              <Store className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">No locations found</h3>
              <p className="text-sm text-muted-foreground">
                No locations match your current search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {stores.map(store => (
          <Card key={store.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={store.logo} 
                    alt={`${store.name} logo`} 
                    className="w-12 h-12 rounded-full object-contain"
                  />
                  <span>{store.name}</span>
                </div>
                <Badge variant="outline">{store.type}</Badge>
              </CardTitle>
              <CardDescription className="space-y-1">
                <div>{store.branches.length} locations</div>
                <div className="text-sm flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  {store.phone}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="text-muted-foreground">Total Services (Month)</div>
                  <div className="font-medium">
                    {store.branches.reduce((sum, branch) => sum + branch.servicesThisMonth, 0)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {store.branches.map(branch => (
                    <div key={branch.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                      <div className="text-sm font-medium">{branch.name}</div>
                      <div className="text-sm">{branch.servicesThisMonth}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStores;
