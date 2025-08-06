# Pedidos Cocina

Aplicación web responsiva para gestión de pedidos entre cocina y jefe de compras.

## Características

- **Sistema de autenticación** con dos roles:
  - **Cocinero**: Acceso para generar y continuar pedidos
  - **Jefe de Compras**: Acceso completo para gestión de artículos, familias, proveedores y formatos

- **Gestión de artículos** con:
  - Nombre
  - Formato
  - Familia
  - Proveedor

- **Gestión de entidades**:
  - Familias
  - Proveedores
  - Formatos

- **Sistema de pedidos**:
  - Creación de pedidos por el cocinero
  - Agrupación automática por proveedor
  - Seguimiento de estados (pendiente, enviado, recibido)
  - Dashboard para el jefe de compras

## Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar la aplicación**:
```bash
npm start
```

3. **Abrir en el navegador**:
```
http://localhost:3000
```

## Uso

### Acceso por Roles

#### Cocinero
- **Contraseña**: `cocinero`
- **Funcionalidades**:
  - Ver artículos agrupados por familias
  - Crear nuevos pedidos
  - Ver historial de pedidos

#### Jefe de Compras
- **Contraseña**: `1950`
- **Funcionalidades**:
  - Todas las funcionalidades del cocinero
  - Gestión de artículos (crear, eliminar)
  - Gestión de familias
  - Gestión de proveedores
  - Gestión de formatos
  - Cambiar estados de pedidos

### Flujo de Trabajo

1. **Configuración inicial** (Jefe de Compras):
   - Crear familias de productos
   - Crear proveedores
   - Crear formatos
   - Crear artículos asociándolos a familias, proveedores y formatos

2. **Creación de pedidos** (Cocinero):
   - Seleccionar artículos por familia
   - Especificar cantidades
   - Crear pedido (se agrupa automáticamente por proveedor)

3. **Seguimiento** (Jefe de Compras):
   - Ver pedidos agrupados por proveedor
   - Actualizar estados de pedidos
   - Gestionar inventario

## Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router** para navegación
- **Tailwind CSS** para estilos responsivos
- **Lucide React** para iconos
- **UUID** para generación de IDs únicos

## Estructura del Proyecto

```
src/
├── components/          # Componentes de la interfaz
│   ├── Login.tsx       # Pantalla de login
│   ├── Layout.tsx      # Layout principal con navegación
│   ├── Pedidos.tsx     # Gestión de pedidos
│   ├── Articulos.tsx   # Gestión de artículos
│   ├── Familias.tsx    # Gestión de familias
│   ├── Proveedores.tsx # Gestión de proveedores
│   └── Formatos.tsx    # Gestión de formatos
├── context/            # Contextos de React
│   ├── AuthContext.tsx # Autenticación y roles
│   └── DataContext.tsx # Gestión de datos
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── index.tsx           # Punto de entrada
└── index.css           # Estilos globales
```

## Características Técnicas

- **Responsive Design**: Adaptable a móviles, tablets y desktop
- **TypeScript**: Tipado estático para mayor seguridad
- **Context API**: Gestión de estado global
- **Componentes Funcionales**: Con hooks de React
- **Tailwind CSS**: Framework de utilidades para diseño rápido

## Notas Importantes

- Los datos se almacenan en memoria (se pierden al recargar la página)
- Para producción, se recomienda implementar persistencia de datos
- Las contraseñas están hardcodeadas para demostración
- En producción, implementar autenticación segura con backend 