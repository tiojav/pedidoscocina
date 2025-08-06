import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Articulo, Familia, Proveedor, Formato, Pedido } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  articulos: Articulo[];
  familias: Familia[];
  proveedores: Proveedor[];
  formatos: Formato[];
  pedidos: Pedido[];
  addArticulo: (articulo: Omit<Articulo, 'id'>) => void;
  addFamilia: (nombre: string) => void;
  addProveedor: (nombre: string) => void;
  addFormato: (nombre: string) => void;
  addPedido: (pedido: Omit<Pedido, 'id'>) => void;
  deleteArticulo: (id: string) => void;
  deleteFamilia: (id: string) => void;
  deleteProveedor: (id: string) => void;
  deleteFormato: (id: string) => void;
  updatePedidoEstado: (id: string, estado: Pedido['estado']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Datos de ejemplo
  const [familias, setFamilias] = useState<Familia[]>([
    { id: '1', nombre: 'Verduras' },
    { id: '2', nombre: 'Carnes' },
    { id: '3', nombre: 'Lácteos' },
    { id: '4', nombre: 'Frutas' },
    { id: '5', nombre: 'Condimentos' }
  ]);

  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: '1', nombre: 'Distribuidora ABC' },
    { id: '2', nombre: 'Proveedor XYZ' },
    { id: '3', nombre: 'Suministros 123' }
  ]);

  const [formatos, setFormatos] = useState<Formato[]>([
    { id: '1', nombre: 'Kg' },
    { id: '2', nombre: 'L' },
    { id: '3', nombre: 'Unidad' },
    { id: '4', nombre: 'Paquete' },
    { id: '5', nombre: 'Docena' }
  ]);

  const [articulos, setArticulos] = useState<Articulo[]>([
    { id: '1', nombre: 'Tomates', formato: '1', familia: '1', proveedor: '1' },
    { id: '2', nombre: 'Cebollas', formato: '1', familia: '1', proveedor: '1' },
    { id: '3', nombre: 'Pollo', formato: '1', familia: '2', proveedor: '2' },
    { id: '4', nombre: 'Carne de Res', formato: '1', familia: '2', proveedor: '2' },
    { id: '5', nombre: 'Leche', formato: '2', familia: '3', proveedor: '3' },
    { id: '6', nombre: 'Queso', formato: '1', familia: '3', proveedor: '3' },
    { id: '7', nombre: 'Manzanas', formato: '3', familia: '4', proveedor: '1' },
    { id: '8', nombre: 'Plátanos', formato: '5', familia: '4', proveedor: '1' },
    { id: '9', nombre: 'Sal', formato: '4', familia: '5', proveedor: '3' },
    { id: '10', nombre: 'Pimienta', formato: '4', familia: '5', proveedor: '3' }
  ]);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const addArticulo = (articulo: Omit<Articulo, 'id'>) => {
    const newArticulo: Articulo = {
      ...articulo,
      id: uuidv4(),
    };
    setArticulos(prev => [...prev, newArticulo]);
  };

  const addFamilia = (nombre: string) => {
    const newFamilia: Familia = {
      id: uuidv4(),
      nombre,
    };
    setFamilias(prev => [...prev, newFamilia]);
  };

  const addProveedor = (nombre: string) => {
    const newProveedor: Proveedor = {
      id: uuidv4(),
      nombre,
    };
    setProveedores(prev => [...prev, newProveedor]);
  };

  const addFormato = (nombre: string) => {
    const newFormato: Formato = {
      id: uuidv4(),
      nombre,
    };
    setFormatos(prev => [...prev, newFormato]);
  };

  const addPedido = (pedido: Omit<Pedido, 'id'>) => {
    const newPedido: Pedido = {
      ...pedido,
      id: uuidv4(),
    };
    setPedidos(prev => [...prev, newPedido]);
  };

  const deleteArticulo = (id: string) => {
    setArticulos(prev => prev.filter(articulo => articulo.id !== id));
  };

  const deleteFamilia = (id: string) => {
    setFamilias(prev => prev.filter(familia => familia.id !== id));
    // También eliminar artículos de esta familia
    setArticulos(prev => prev.filter(articulo => articulo.familia !== id));
  };

  const deleteProveedor = (id: string) => {
    setProveedores(prev => prev.filter(proveedor => proveedor.id !== id));
    // También eliminar artículos de este proveedor
    setArticulos(prev => prev.filter(articulo => articulo.proveedor !== id));
  };

  const deleteFormato = (id: string) => {
    setFormatos(prev => prev.filter(formato => formato.id !== id));
    // También eliminar artículos de este formato
    setArticulos(prev => prev.filter(articulo => articulo.formato !== id));
  };

  const updatePedidoEstado = (id: string, estado: Pedido['estado']) => {
    setPedidos(prev => 
      prev.map(pedido => {
        if (pedido.id === id) {
          // Si el estado cambia a 'enviado' y no tiene fecha de envío, agregarla
          if (estado === 'enviado' && !pedido.fechaEnvio) {
            return { ...pedido, estado, fechaEnvio: new Date() };
          }
          return { ...pedido, estado };
        }
        return pedido;
      })
    );
  };

  return (
    <DataContext.Provider value={{
      articulos,
      familias,
      proveedores,
      formatos,
      pedidos,
      addArticulo,
      addFamilia,
      addProveedor,
      addFormato,
      addPedido,
      deleteArticulo,
      deleteFamilia,
      deleteProveedor,
      deleteFormato,
      updatePedidoEstado,
    }}>
      {children}
    </DataContext.Provider>
  );
}; 