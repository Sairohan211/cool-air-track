
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Store, MapPin, BarChart3, MoreHorizontal, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for stores
const stores = [
  { 
    id: 1, 
    name: "Lifestyle", 
    type: "Franchise", 
    branches: [
      { id: 101, name: "Hyderabad Central", location: "Punjagutta Road", servicesThisMonth: 25 },
      { id: 102, name: "Secundrabad", location: "MG Road", servicesThisMonth: 18 },
      { id: 103, name: "Kukatpally", location: "KPHB Colony", servicesThisMonth: 22 }
    ]
  },
  { 
    id: 2, 
    name: "Max", 
    type: "Franchise", 
    branches: [
      { id: 201, name: "Hitech City", location: "Madhapur", servicesThisMonth: 30 },
      { id: 202, name: "Banjara Hills", location: "Road No. 12", servicesThisMonth: 24 },
      { id: 203, name: "ECIL", location: "Kushaiguda", servicesThisMonth: 15 }
    ]
  },
  { 
    id: 3, 
    name: "Easy", 
    type: "Franchise", 
    branches: [
      { id: 301, name: "Ameerpet", location: "SR Nagar", servicesThisMonth: 20 },
      { id: 302, name: "Dilsukhnagar", location: "Moosaram Bagh", servicesThisMonth: 16 },
      { id: 303, name: "Gachibowli", location: "Financial District", servicesThisMonth: 19 }
    ]
  }
];

const AdminStores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  
  // Get all branches across all stores
  const allBranches = stores.flatMap(store => 
    store.branches.map(branch => ({
      ...branch,
      storeName: store.name,
      storeId: store.id
    }))
  );
  
  // Filter branches based on search and store filter
  const filteredBranches = allBranches.filter(branch => {
    const matchesSearch = 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStore = storeFilter === "all" || branch.storeId.toString() === storeFilter;
    
    return matchesSearch && matchesStore;
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stores & Branches</h1>
        <p className="text-muted-foreground">
          Manage store franchises and their branches
        </p>
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
              placeholder="Search branches..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                  Add a new branch to an existing store franchise.
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
                  <Label htmlFor="branchName" className="text-right">
                    Branch Name
                  </Label>
                  <Input id="branchName" placeholder="Branch Name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input id="location" placeholder="Location" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input id="address" placeholder="Full Address" className="col-span-3" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Branch</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 border-b">
          <Tabs defaultValue="branches">
            <TabsList>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="franchises">Franchises</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch Name</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Location</TableHead>
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
              <h3 className="text-lg font-medium">No branches found</h3>
              <p className="text-sm text-muted-foreground">
                No branches match your current search criteria.
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
                <span>{store.name}</span>
                <Badge variant="outline">{store.type}</Badge>
              </CardTitle>
              <CardDescription>
                {store.branches.length} branches
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
                
                <Button variant="ghost" size="sm" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStores;
