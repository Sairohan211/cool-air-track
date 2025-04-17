
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Auth Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// App Pages
import TechnicianDashboard from "./pages/technician/Dashboard";
import TechnicianAttendance from "./pages/technician/Attendance";
import TechnicianService from "./pages/technician/Service";
import TechnicianHistory from "./pages/technician/History";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTechnicians from "./pages/admin/Technicians";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminStores from "./pages/admin/Stores";
import AdminReports from "./pages/admin/Reports";

// Layout Components
import AuthLayout from "./components/layouts/AuthLayout";
import TechnicianLayout from "./components/layouts/TechnicianLayout";
import AdminLayout from "./components/layouts/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Technician Routes */}
          <Route path="/technician" element={<TechnicianLayout />}>
            <Route index element={<TechnicianDashboard />} />
            <Route path="attendance" element={<TechnicianAttendance />} />
            <Route path="service" element={<TechnicianService />} />
            <Route path="history" element={<TechnicianHistory />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
