import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainLayout from "./components/Layout/MainLayout";
import POS from "./pages/POS";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Menu from "./pages/Menu";
import Delivery from "./pages/Delivery";
import PincodeVerification from "./pages/PincodeVerification.tsx";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Pages - No Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/verify-pincode" element={<PincodeVerification />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected Routes - With Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            } />
            <Route path="/pos" element={
              <RequireAuth>
                <POS />
              </RequireAuth>
            } />
            <Route path="/menu" element={
              <RequireAuth>
                <Menu />
              </RequireAuth>
            } />
            <Route path="/delivery" element={
              <RequireAuth>
                <Delivery />
              </RequireAuth>
            } />
            <Route path="/analytics" element={
              <RequireAuth>
                <Analytics />
              </RequireAuth>
            } />
            <Route path="/settings" element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;