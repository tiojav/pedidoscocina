export interface Articulo {
  id: string;
  nombre: string;
  formato: string;
  familia: string;
  proveedor: string;
  descripcion?: string;
  precio?: number;
}

export interface Familia {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
}

export interface Formato {
  id: string;
  nombre: string;
}

export interface Pedido {
  id: string;
  fecha: Date;
  fechaEnvio?: Date;
  articulos: PedidoArticulo[];
  estado: 'pendiente' | 'enviado' | 'recibido' | 'en_proceso' | 'completado' | 'cancelado';
  proveedor: string;
  notas?: string;
  creadoPor: string;
}

export interface PedidoArticulo {
  id: string;
  nombre: string;
  cantidad: number;
  formato: string;
  precio?: number;
  proveedor?: string;
}

export type UserRole = 'cocinero' | 'jefe_compras'; 