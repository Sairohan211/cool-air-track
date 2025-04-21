import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirVent } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const [techId, setTechId] = useState('');
  const [techPasscode, setTechPasscode] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false);
  const [isFirstTimeDialogOpen, setIsFirstTimeDialogOpen] = useState(false);
  const [setupAdminName, setSetupAdminName] = useState('');
  const [setupAdminUsername, setSetupAdminUsername] = useState('');
  const [setupAdminPassword, setSetupAdminPassword] = useState('');
  const [setupAdminPasswordConfirm, setSetupAdminPasswordConfirm] = useState('');

  // Check if there's any admin account (using localStorage as a simple way to demonstrate)
  useEffect(() => {
    const hasExistingAdmin = localStorage.getItem('adminAccounts');
    setShowFirstTimeSetup(!hasExistingAdmin || hasExistingAdmin === '[]');
  }, []);

  // Check if the user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (isLoggedIn === 'true') {
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'technician') {
        navigate('/technician');
      }
    }
  }, [navigate]);

  const handleTechnicianLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real application, we would authenticate against a backend here
    setTimeout(() => {
      // Save login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'technician');
      localStorage.setItem('techId', techId);
      
      navigate('/technician');
      setLoading(false);
    }, 1000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if admin exists in local storage
    const admins = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
    const admin = admins.find(
      (admin: any) => admin.username === adminUsername && admin.password === adminPassword
    );

    if (admin) {
      // Save login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('adminUsername', adminUsername);
      localStorage.setItem('adminName', admin.name);
      
      setTimeout(() => {
        navigate('/admin');
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive"
      });
    }
  };

  const handleSetupFirstAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (setupAdminPassword !== setupAdminPasswordConfirm) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered don't match.",
        variant: "destructive"
      });
      return;
    }

    if (setupAdminPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    // Create the first admin account
    const firstAdmin = {
      name: setupAdminName,
      username: setupAdminUsername,
      password: setupAdminPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage (in a real app, this would be in a secure database)
    localStorage.setItem('adminAccounts', JSON.stringify([firstAdmin]));
    
    // Also log the user in immediately
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('adminUsername', setupAdminUsername);
    localStorage.setItem('adminName', setupAdminName);
    
    // Close the dialog and update state
    setIsFirstTimeDialogOpen(false);
    setShowFirstTimeSetup(false);
    
    toast({
      title: "Admin Account Created",
      description: "Logging you in with your new admin account.",
      variant: "default"
    });
    
    // Navigate to admin dashboard
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-acblue-100 to-white">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3 text-white">
            <AirVent size={40} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-1 text-gray-800">SLV CLIMATE SOLUTIONS</h1>
        <p className="text-center text-gray-500 mb-6">Attendance & Service Management</p>
        
        <Card className="w-full">
          <Tabs defaultValue="technician">
            <CardHeader>
              <div className="flex justify-center">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="technician">Technician</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="technician">
                <form onSubmit={handleTechnicianLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="techId" className="text-sm font-medium">
                        Technician ID
                      </label>
                      <Input
                        id="techId"
                        placeholder="Enter your ID"
                        value={techId}
                        onChange={(e) => setTechId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="techPasscode" className="text-sm font-medium">
                        Passcode
                      </label>
                      <Input
                        id="techPasscode"
                        type="password"
                        placeholder="Enter your passcode"
                        value={techPasscode}
                        onChange={(e) => setTechPasscode(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login as Technician'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="adminUsername" className="text-sm font-medium">
                        Username
                      </label>
                      <Input
                        id="adminUsername"
                        placeholder="Enter admin username"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="adminPassword" className="text-sm font-medium">
                        Password
                      </label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login as Admin'}
                    </Button>
                    
                    {showFirstTimeSetup && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <p className="text-sm text-gray-500 mb-2">First time using the system?</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsFirstTimeDialogOpen(true)}
                          className="w-full"
                        >
                          Set Up First Admin Account
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* First-time setup dialog */}
      <Dialog open={isFirstTimeDialogOpen} onOpenChange={setIsFirstTimeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create First Admin Account</DialogTitle>
            <DialogDescription>
              This account will have full administrative access to the system.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSetupFirstAdmin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setupName" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="setupName"
                  value={setupAdminName}
                  onChange={(e) => setSetupAdminName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setupUsername" className="text-right">
                  Username
                </Label>
                <Input
                  id="setupUsername"
                  value={setupAdminUsername}
                  onChange={(e) => setSetupAdminUsername(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setupPassword" className="text-right">
                  Password
                </Label>
                <Input
                  id="setupPassword"
                  type="password"
                  value={setupAdminPassword}
                  onChange={(e) => setSetupAdminPassword(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="setupPasswordConfirm" className="text-right">
                  Confirm
                </Label>
                <Input
                  id="setupPasswordConfirm"
                  type="password"
                  value={setupAdminPasswordConfirm}
                  onChange={(e) => setSetupAdminPasswordConfirm(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFirstTimeDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Admin Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
