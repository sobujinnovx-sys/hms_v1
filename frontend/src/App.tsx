import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@components/MainLayout';
import { ProtectedRoute } from '@components/ProtectedRoute';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';
import { PatientsPage } from '@pages/PatientsPage';
import { DoctorsPage } from '@pages/DoctorsPage';
import { AppointmentsPage } from '@pages/AppointmentsPage';
import { BillingPage } from '@pages/BillingPage';
import { useAuthStore } from '@stores/authStore';
import './index.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PatientsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DoctorsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AppointmentsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BillingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
