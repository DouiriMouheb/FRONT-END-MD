
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Example from './pages/Example';

const App = () => (
  <ThemeProvider>
    <Router>
      <MainLayout>
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
          <Route path="/" element={<Home />} />
          <Route path="/example" element={<Example />} />
        </Routes>
      </MainLayout>
    </Router>
  </ThemeProvider>
);

export default App;
