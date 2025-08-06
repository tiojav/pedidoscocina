export interface Articulo {
  id: string;
  nombre: string;
  formato: string;
  familia: string;
  proveedor: string;
}

export interface Familia {
  id: string;
  nombre: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
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
  estado: 'pendiente' | 'enviado' | 'recibido';
  proveedor: string;
}

export interface PedidoArticulo {
  articuloId: string;
  cantidad: number;
  nombre: string;
  formato: string;
  familia: string;
  proveedor: string;
}

export type UserRole = 'cocinero' | 'jefe_compras'; 