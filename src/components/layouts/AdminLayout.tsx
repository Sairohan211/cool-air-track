
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Store, BarChart, LogOut, Menu, X, Briefcase, CreditCard } from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full hover:bg-primary-foreground/10"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-bold">AC Services Admin</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-primary-foreground/10"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile (Overlay) */}
        <div 
          className={`fixed inset-0 bg-black/50 z-10 md:hidden transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        />

        {/* Sidebar */}
        <nav 
          className={`fixed md:static w-64 bg-white shadow-lg h-full z-20 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-primary">AC Services</h1>
              <p className="text-sm text-gray-500">Admin Portal</p>
            </div>

            <div className="flex-1 space-y-2">
              <NavItem 
                to="/admin" 
                icon={<Home size={20} />} 
                label="Dashboard" 
                active={location.pathname === '/admin'} 
              />
              <NavItem 
                to="/admin/technicians" 
                icon={<Users size={20} />} 
                label="Technicians" 
                active={location.pathname === '/admin/technicians'} 
              />
              <NavItem 
                to="/admin/stores" 
                icon={<Store size={20} />} 
                label="Stores" 
                active={location.pathname === '/admin/stores'} 
              />
              <NavItem 
                to="/admin/amc-customers" 
                icon={<CreditCard size={20} />} 
                label="AMC Customers" 
                active={location.pathname === '/admin/amc-customers'} 
              />
              <NavItem 
                to="/admin/reports" 
                icon={<BarChart size={20} />} 
                label="Reports" 
                active={location.pathname === '/admin/reports'} 
              />
            </div>

            <div className="pt-6 border-t border-gray-200 md:block hidden">
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
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

export default AdminLayout;
