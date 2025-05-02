import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import AuthCallback from "./pages/AuthCallback";
import BookingDetail from "./pages/BookingDetail";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewBookingPage from "./pages/NewBookingPage";
import NotFound from "./pages/NotFound";
import { VerifyEmail } from "./pages/VerifyEmail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookingProvider>
        <TooltipProvider>
          <Toaster />
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="auth/callback" element={<AuthCallback />} />
                <Route
                  path="bookings/new"
                  element={
                    <ProtectedRoute>
                      <NewBookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="bookings/:id" element={<BookingDetail />} />
                <Route path="verify/:type/:id/:token" element={<VerifyEmail />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BookingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
