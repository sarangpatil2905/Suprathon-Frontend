import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Dashboard from "./pages/StudentDashboard";
import Companies from "./pages/Companies";
import PlacementStats from "./pages/PlacementStats";
import Admin from "./pages/Admin";
import AdminCompanies from "./pages/CompaniesAdmin";
import AcceptAdmin from "./pages/AcceptAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/companies' element={<Companies />} />
          <Route path='/placement-stats' element={<PlacementStats />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/companies-admin' element={<AdminCompanies />} />
          <Route path='/accept-admin/:companyId' element={<AcceptAdmin />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
