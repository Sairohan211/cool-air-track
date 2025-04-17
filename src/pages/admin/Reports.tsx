
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Calendar, FileText, Download, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
// Import date picker component if needed
// import { DatePickerWithRange } from "../../components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for monthly service trends
const monthlyServiceData = [
  { month: "Jan", services: 65 },
  { month: "Feb", services: 80 },
  { month: "Mar", services: 90 },
  { month: "Apr", services: 71 },
  { month: "May", services: 85 },
  { month: "Jun", services: 95 },
  { month: "Jul", services: 100 },
  { month: "Aug", services: 120 },
  { month: "Sep", services: 110 },
  { month: "Oct", services: 105 },
  { month: "Nov", services: 90 },
  { month: "Dec", services: 85 }
];

// Mock data for technician performance
const technicianPerformance = [
  { name: "John Doe", services: 28, attendance: 98 },
  { name: "Jane Smith", services: 32, attendance: 100 },
  { name: "Mike Johnson", services: 10, attendance: 75 },
  { name: "Sarah Williams", services: 24, attendance: 95 },
  { name: "David Brown", services: 22, attendance: 90 }
];

// Mock data for store comparison
const storeComparison = [
  { name: "Lifestyle", services: 65, branches: 3 },
  { name: "Max", services: 69, branches: 3 },
  { name: "Easy", services: 55, branches: 3 }
];

// Mock data for service type distribution
const serviceTypeData = [
  { name: "Installation", value: 20 },
  { name: "Servicing", value: 45 },
  { name: "Repair", value: 25 },
  { name: "Maintenance", value: 10 }
];

// Mock data for recent reports
const recentReports = [
  { 
    id: 1, 
    name: "Monthly Service Report", 
    description: "Summary of all services performed in March 2023",
    date: "2023-04-01", 
    type: "monthly" 
  },
  { 
    id: 2, 
    name: "Technician Performance Q1", 
    description: "Performance analysis of all technicians for Q1 2023",
    date: "2023-04-02", 
    type: "quarterly" 
  },
  { 
    id: 3, 
    name: "Store Comparison", 
    description: "Comparative analysis of all store franchises",
    date: "2023-03-15", 
    type: "custom" 
  },
  { 
    id: 4, 
    name: "Attendance Report", 
    description: "Attendance statistics for March 2023",
    date: "2023-04-01", 
    type: "monthly" 
  }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Mock component for date range picker
const DatePickerWithRange = ({ className }: { className?: string }) => (
  <div className={className}>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select date range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="yesterday">Yesterday</SelectItem>
        <SelectItem value="7days">Last 7 days</SelectItem>
        <SelectItem value="30days">Last 30 days</SelectItem>
        <SelectItem value="thismonth">This Month</SelectItem>
        <SelectItem value="lastmonth">Last Month</SelectItem>
        <SelectItem value="custom">Custom Range</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const AdminReports = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("services");
  
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
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          View performance reports and analytics
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <DatePickerWithRange className="w-full md:w-[300px]" />
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="attendance">Attendance</SelectItem>
              <SelectItem value="technicians">Technicians</SelectItem>
              <SelectItem value="stores">Stores</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center">
            <LineChartIcon className="mr-2 h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="technicians" className="flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Saved Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Service Trend</CardTitle>
                <CardDescription>
                  Number of services performed each month
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyServiceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="services" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Service Types</CardTitle>
                <CardDescription>
                  Distribution by service category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Store Comparison</CardTitle>
                <CardDescription>
                  Services by store franchise
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storeComparison}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="services" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technician Performance</CardTitle>
                <CardDescription>
                  Top performing technicians by service count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead className="text-right">Services</TableHead>
                      <TableHead className="text-right">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicianPerformance.slice(0, 5).map(tech => (
                      <TableRow key={tech.name}>
                        <TableCell className="font-medium">{tech.name}</TableCell>
                        <TableCell className="text-right">{tech.services}</TableCell>
                        <TableCell className="text-right">{tech.attendance}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of service metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyServiceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="services" 
                    name="Total Services"
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="technicians" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technician Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis of all technicians
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={technicianPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="services" name="Services" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="attendance" name="Attendance (%)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>
                Access and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recentReports.map(report => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(report.date)}
                        </div>
                        <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {report.type === 'monthly' ? 'Monthly' : 
                           report.type === 'quarterly' ? 'Quarterly' : 'Custom'}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{report.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {report.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                    </CardContent>
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

export default AdminReports;
