import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Pedidos from './components/Pedidos';
import Articulos from './components/Articulos';
import Familias from './components/Familias';
import Proveedores from './components/Proveedores';
import Formatos from './components/Formatos';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pedidos" replace />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/articulos" element={<Articulos />} />
        <Route path="/familias" element={<Familias />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/formatos" element={<Formatos />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 