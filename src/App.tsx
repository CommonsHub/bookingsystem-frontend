
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { BookingProvider } from "./context/BookingProvider";
import { TranslationProvider } from "./i18n/TranslationProvider";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NewBookingPage from "./pages/NewBookingPage";
import BookingDetail from "./pages/BookingDetail";
import ProfilePage from "./pages/ProfilePage";
import AuthCallback from "./pages/AuthCallback";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import EditBookingPage from "./pages/EditBookingPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <TranslationProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/bookings/new" element={<NewBookingPage />} />
                <Route path="/bookings/:id" element={<BookingDetail />} />
                <Route path="/bookings/:id/edit" element={<EditBookingPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </TranslationProvider>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
