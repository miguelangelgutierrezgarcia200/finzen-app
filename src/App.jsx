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
import { ProfilePage } from "./pages/ProfilePage";
import { GamePage } from "./pages/GamePage"; // <-- Asegúrate de importar tu página de juegos

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#120C0A', color: '#F7E9DA' }}>
    Cargando...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ style: { background: '#251A14', color: '#F7E9DA' } }} />
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/auth" element={
            <PublicOnlyRoute>
              <AuthPage />
            </PublicOnlyRoute>
          } />
          
          {/* Rutas Privadas del Panel */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="calculators" element={<CalculatorPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="academy" element={<AcademyPage />} />
            <Route path="game" element={<GamePage />} /> {/* <-- Cambiado a GamePage */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}