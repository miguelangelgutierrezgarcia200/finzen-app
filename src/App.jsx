import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import { AuthPage } from "./pages/AuthPage";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { AcademyPage } from "./pages/AcademyPage";

// Protege las rutas privadas (si no hay sesión, manda a /auth)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Espera a que Firebase responda antes de redirigir
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// Evita que un usuario logueado vuelva a ver el login
const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />; // Si ya inició sesión, manda al Dashboard
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: '#251A14', color: '#F7E9DA' } }} />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="calculators" element={<CalculatorPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="academy" element={<AcademyPage />} />
            <Route path="game" element={<DashboardPage />} />
            <Route path="profile" element={<DashboardPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}