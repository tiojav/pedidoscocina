import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Tipos de datos
export interface Pedido {
  id?: string;
  fecha: Date;
  articulos: ArticuloPedido[];
  estado: 'pendiente' | 'enviado' | 'recibido' | 'en_proceso' | 'completado' | 'cancelado';
  proveedor: string;
  notas?: string;
  creadoPor: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArticuloPedido {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  precio?: number;
}

export interface Articulo {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  unidad: string;
  familia?: string;
  proveedor?: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Familia {
  id?: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface Proveedor {
  id?: string;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

// Servicios para Pedidos
export const pedidosService = {
  // Crear nuevo pedido
  async crearPedido(pedido: Omit<Pedido, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'pedidos'), {
      ...pedido,
      fecha: Timestamp.fromDate(pedido.fecha),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Obtener todos los pedidos
  async obtenerPedidos(): Promise<Pedido[]> {
    const q = query(collection(db, 'pedidos'), orderBy('fecha', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Pedido[];
  },

  // Obtener pedido por ID
  async obtenerPedido(id: string): Promise<Pedido | null> {
    const docRef = doc(db, 'pedidos', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        fecha: data.fecha.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Pedido;
    }
    return null;
  },

  // Actualizar pedido
  async actualizarPedido(id: string, pedido: Partial<Pedido>): Promise<void> {
    const docRef = doc(db, 'pedidos', id);
    await updateDoc(docRef, {
      ...pedido,
      updatedAt: Timestamp.now()
    });
  },

  // Eliminar pedido
  async eliminarPedido(id: string): Promise<void> {
    const docRef = doc(db, 'pedidos', id);
    await deleteDoc(docRef);
  },

  // Escuchar cambios en tiempo real
  suscribirPedidos(callback: (pedidos: Pedido[]) => void) {
    const q = query(collection(db, 'pedidos'), orderBy('fecha', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const pedidos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        fecha: doc.data().fecha.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Pedido[];
      callback(pedidos);
    });
  }
};

// Servicios para Artículos
export const articulosService = {
  // Crear nuevo artículo
  async crearArticulo(articulo: Omit<Articulo, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'articulos'), {
      ...articulo,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Obtener todos los artículos
  async obtenerArticulos(): Promise<Articulo[]> {
    const q = query(collection(db, 'articulos'), orderBy('nombre'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Articulo[];
  },

  // Obtener artículos activos
  async obtenerArticulosActivos(): Promise<Articulo[]> {
    const q = query(
      collection(db, 'articulos'), 
      where('activo', '==', true),
      orderBy('nombre')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Articulo[];
  },

  // Actualizar artículo
  async actualizarArticulo(id: string, articulo: Partial<Articulo>): Promise<void> {
    const docRef = doc(db, 'articulos', id);
    await updateDoc(docRef, {
      ...articulo,
      updatedAt: Timestamp.now()
    });
  },

  // Eliminar artículo
  async eliminarArticulo(id: string): Promise<void> {
    const docRef = doc(db, 'articulos', id);
    await deleteDoc(docRef);
  }
};

// Servicios para Familias
export const familiasService = {
  async crearFamilia(familia: Omit<Familia, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'familias'), {
      ...familia,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async obtenerFamilias(): Promise<Familia[]> {
    const q = query(collection(db, 'familias'), orderBy('nombre'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Familia[];
  },

  async actualizarFamilia(id: string, familia: Partial<Familia>): Promise<void> {
    const docRef = doc(db, 'familias', id);
    await updateDoc(docRef, {
      ...familia,
      updatedAt: Timestamp.now()
    });
  },

  async eliminarFamilia(id: string): Promise<void> {
    const docRef = doc(db, 'familias', id);
    await deleteDoc(docRef);
  }
};

// Servicios para Proveedores
export const proveedoresService = {
  async crearProveedor(proveedor: Omit<Proveedor, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'proveedores'), {
      ...proveedor,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async obtenerProveedores(): Promise<Proveedor[]> {
    const q = query(collection(db, 'proveedores'), orderBy('nombre'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Proveedor[];
  },

  async actualizarProveedor(id: string, proveedor: Partial<Proveedor>): Promise<void> {
    const docRef = doc(db, 'proveedores', id);
    await updateDoc(docRef, {
      ...proveedor,
      updatedAt: Timestamp.now()
    });
  },

  async eliminarProveedor(id: string): Promise<void> {
    const docRef = doc(db, 'proveedores', id);
    await deleteDoc(docRef);
  }
}; 