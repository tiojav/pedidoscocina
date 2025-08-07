import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChefHat, ShoppingCart, Package, Users, FileText, ClipboardList, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userRole, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      name: 'Pedidos',
      href: '/pedidos',
      icon: ClipboardList,
      roles: ['cocinero', 'jefe_compras']
    },
    {
      name: 'Artículos',
      href: '/articulos',
      icon: Package,
      roles: ['jefe_compras']
    },
    {
      name: 'Familias',
      href: '/familias',
      icon: FileText,
      roles: ['jefe_compras']
    },
    {
      name: 'Proveedores',
      href: '/proveedores',
      icon: Users,
      roles: ['jefe_compras']
    },
    {
      name: 'Formatos',
      href: '/formatos',
      icon: FileText,
      roles: ['jefe_compras']
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(userRole!)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Pedidos Cocina
              </h1>
              <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {userRole === 'cocinero' ? 'Cocinero' : 'Jefe de Compras'}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm min-h-screen transition-all duration-300 ease-in-out`}>
          <div className="p-4">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={!sidebarOpen ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 