
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirVent } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [techId, setTechId] = useState('');
  const [techPasscode, setTechPasscode] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTechnicianLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real application, we would authenticate against a backend here
    setTimeout(() => {
      navigate('/technician');
      setLoading(false);
    }, 1000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real application, we would authenticate against a backend here
    setTimeout(() => {
      navigate('/admin');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-acblue-100 to-white">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <div className="bg-primary rounded-full p-3 text-white">
            <AirVent size={40} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-1 text-gray-800">AC Services</h1>
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
                  </div>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
