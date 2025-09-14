import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        {children}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-custom text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to={`/${user.role === 'admin' ? 'admin' : user.role === 'store_owner' ? 'owner' : 'user'}`} replace /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/user" replace /> : <Signup />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner" 
              element={
                <ProtectedRoute allowedRoles={['store_owner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Redirects */}
            <Route 
              path="/" 
              element={
                user ? (
                  <Navigate 
                    to={`/${user.role === 'admin' ? 'admin' : user.role === 'store_owner' ? 'owner' : 'user'}`} 
                    replace 
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            
            {/* Unauthorized Route */}
            <Route 
              path="/unauthorized" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-destructive mb-4">Unauthorized</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                  </div>
                </div>
              } 
            />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
