import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, UserCheck, FileText, History, LogOut } from 'lucide-react';

const TechnicianLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('techId');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-primary text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">SLV CLIMATE SOLUTIONS (employee)</h1>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-primary-foreground/10"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <nav className="hidden md:block w-64 bg-white shadow-md p-6">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">SLV CLIMATE SOLUTIONS</h1>
            <p className="text-sm text-gray-500">Technician Portal</p>
          </div>

          <div className="flex-1 space-y-2">
            <NavItem 
              to="/technician" 
              icon={<Home size={20} />} 
              label="Dashboard" 
              active={location.pathname === '/technician'} 
            />
            <NavItem 
              to="/technician/attendance" 
              icon={<UserCheck size={20} />} 
              label="Attendance" 
              active={location.pathname === '/technician/attendance'} 
            />
            <NavItem 
              to="/technician/service" 
              icon={<FileText size={20} />} 
              label="Service Form" 
              active={location.pathname === '/technician/service'} 
            />
            <NavItem 
              to="/technician/history" 
              icon={<History size={20} />} 
              label="History" 
              active={location.pathname === '/technician/history'} 
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary w-full p-2 rounded transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-10">
        <MobileNavItem 
          to="/technician" 
          icon={<Home size={20} />} 
          label="Home" 
          active={location.pathname === '/technician'} 
        />
        <MobileNavItem 
          to="/technician/attendance" 
          icon={<UserCheck size={20} />} 
          label="Attend" 
          active={location.pathname === '/technician/attendance'} 
        />
        <MobileNavItem 
          to="/technician/service" 
          icon={<FileText size={20} />} 
          label="Service" 
          active={location.pathname === '/technician/service'} 
        />
        <MobileNavItem 
          to="/technician/history" 
          icon={<History size={20} />} 
          label="History" 
          active={location.pathname === '/technician/history'} 
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 mb-16 md:mb-0">
        <Outlet />
      </main>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const MobileNavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-2 rounded-md ${
        active ? 'text-primary' : 'text-gray-500'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default TechnicianLayout;
