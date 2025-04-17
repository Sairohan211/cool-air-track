
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, FileText, History, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">{date}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Status</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              Not Checked In
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Mark your attendance for today
            </p>
            <Button 
              className="w-full mt-4" 
              variant="default"
              onClick={() => navigate('/technician/attendance')}
            >
              Check In Now
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">3 Completed</div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/technician/service')}
            >
              New Service
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">12 Services</div>
            <p className="text-xs text-muted-foreground mt-2">
              3 stores, 4 days worked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Service History</div>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => navigate('/technician/history')}
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest service submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="font-medium">Lifestyle Store - AC Servicing</div>
                <div className="text-sm text-muted-foreground">Today at 10:24 AM</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="font-medium">Max Store - AC Installation</div>
                <div className="text-sm text-muted-foreground">Yesterday at 2:15 PM</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="font-medium">Easy Store - AC Repair</div>
                <div className="text-sm text-muted-foreground">Yesterday at 11:30 AM</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/technician/attendance')}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/technician/service')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Submit Service Receipt
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate('/technician/history')}
            >
              <History className="mr-2 h-4 w-4" />
              View Service History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
