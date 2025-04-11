
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BookingDetail from "./pages/BookingDetail";
import NewBookingPage from "./pages/NewBookingPage";
import { VerifyEmail } from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import { BookingProvider } from "./context/BookingContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="bookings/new" element={<NewBookingPage />} />
              <Route path="bookings/:id" element={<BookingDetail />} />
              <Route path="verify/:type/:id/:token" element={<VerifyEmail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BookingProvider>
  </QueryClientProvider>
);

export default App;
