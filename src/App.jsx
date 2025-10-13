
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Example from './pages/Example';
import BatchEditing from './pages/BatchEditing';
import Messenger from './pages/Messenger';
import ProfileSettings from './pages/ProfileSettings';
import Dashboard from './pages/Dashboard';

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: { 
                background: 'hsl(var(--success))', 
                color: 'hsl(var(--success-foreground))',
                border: '1px solid hsl(var(--success))'
              },
              iconTheme: { 
                primary: 'hsl(var(--success-foreground))', 
                secondary: 'hsl(var(--success))' 
              },
            },
            error: {
              style: { 
                background: 'hsl(var(--error))', 
                color: 'hsl(var(--error-foreground))',
                border: '1px solid hsl(var(--error))'
              },
              iconTheme: { 
                primary: 'hsl(var(--error-foreground))', 
                secondary: 'hsl(var(--error))' 
              },
            },
            loading: {
              style: { 
                background: 'hsl(var(--info))', 
                color: 'hsl(var(--info-foreground))',
                border: '1px solid hsl(var(--info))'
              },
            },
          }} 
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/example"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Example />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/batch-editing"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BatchEditing />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Messenger />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfileSettings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* Catch-all route - redirect to home or login */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
