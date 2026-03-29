import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import NexGoApp from "@/components/NexGo";
import { RedirectIfAuth, RequireAuth } from "@/components/RouteGuards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RedirectIfAuth><LandingPage /></RedirectIfAuth>} />
            <Route path="/signin" element={<RedirectIfAuth><SignIn /></RedirectIfAuth>} />
            <Route path="/signup" element={<RedirectIfAuth><SignUp /></RedirectIfAuth>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app" element={<RequireAuth><NexGoApp /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
