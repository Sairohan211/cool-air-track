import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { UserCheck, FileText, Store, CheckCheck, Clock } from 'lucide-react';
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState({
    name: "",
    role: "Admin"
  });

  useEffect(() => {
    // Get the admin name from localStorage
    const adminName = localStorage.getItem('adminName');
    
    if (adminName) {
      setCurrentUser(prev => ({
        ...prev,
        name: adminName
      }));
    }
  }, []);

  const recentServices = [
    {
      id: 1,
      technician: "John Doe",
      store: "Lifestyle",
      branch: "Hyderabad Central",
      type: "Installation",
      date: "2023-04-15T10:30:00"
    },
    {
      id: 2,
      technician: "Jane Smith",
      store: "Max",
      branch: "Hitech City",
      type: "Servicing",
      date: "2023-04-15T09:15:00"
    },
    {
      id: 3,
      technician: "Mike Johnson",
      store: "Easy",
      branch: "Ameerpet",
      type: "Repair",
      date: "2023-04-14T14:00:00"
    },
    {
      id: 4,
      technician: "Sarah Williams",
      store: "Lifestyle",
      branch: "Secundrabad",
      type: "Maintenance",
      date: "2023-04-14T11:45:00"
    }
  ];

  const storeServiceData = [
    { name: "Lifestyle", value: 35 },
    { name: "Max", value: 40 },
    { name: "Easy", value: 25 }
  ];

  const serviceTypeData = [
    { name: "Installation", value: 20 },
    { name: "Servicing", value: 45 },
    { name: "Repair", value: 25 },
    { name: "Maintenance", value: 10 }
  ];

  const weeklyTrendData = [
    { day: "Mon", services: 8 },
    { day: "Tue", services: 12 },
    { day: "Wed", services: 10 },
    { day: "Thu", services: 15 },
    { day: "Fri", services: 18 },
    { day: "Sat", services: 6 },
    { day: "Sun", services: 2 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-6">
          <p className="text-xl text-muted-foreground">
            Namaste 🙏 Welcome back,
          </p>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            {currentUser.name}
          </h1>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Overview of technician activities and services
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Technicians
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              10 active today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Services This Week
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71</div>
            <p className="text-xs text-muted-foreground mt-1">
              +15% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stores
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 3 franchises
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Service Trend</CardTitle>
            <CardDescription>
              Number of services performed each day
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px' 
                    }} 
                  />
                  <Bar 
                    dataKey="services" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>
              Latest services performed by technicians
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentServices.map(service => (
                <div key={service.id} className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {service.store} - {service.branch}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {service.type} by {service.technician}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(service.date)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Store Distribution</CardTitle>
            <CardDescription>
              Services by store franchise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storeServiceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {storeServiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Type Breakdown</CardTitle>
            <CardDescription>
              Distribution of service types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
