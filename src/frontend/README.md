# OrderFlow Frontend

Portal de gestión de órdenes con React + TypeScript.

## Inicio rápido

### Instalación

```bash
cd src/frontend
npm install
```

### Desarrollo

```bash
npm run dev
```

El aplicativo estará disponible en `http://localhost:5173`.

**Requisito:** El backend debe estar corriendo en `http://localhost:3000`.

```bash
# En otra terminal, desde la raíz del proyecto
npm start
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test                # Ejecutar tests
npm run test:coverage   # Tests + cobertura
```

### Type checking

```bash
npm run type-check
```

## Estructura

```
src/frontend/
├── src/
│   ├── types/              # Tipos TypeScript (Order, CreateOrderRequest, etc.)
│   ├── services/           # Integración con API backend
│   ├── components/
│   │   ├── common/         # Botones, inputs, spinners, alertas
│   │   └── orders/         # Componentes de órdenes (lista, formulario)
│   ├── pages/              # Página principal (HomePage)
│   ├── App.tsx             # Componente raíz
│   └── main.tsx            # Punto de entrada
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Funcionalidades Implementadas

### ✅ Pantalla de Inicio (Homepage)

- **Panel izquierdo**: Listado de órdenes con:
  - Email del cliente
  - Número de artículos
  - Total (con descuento si aplica)
  - Estado de la orden
  - Botones de Editar y Eliminar

- **Panel derecho**: Formulario de crear/editar órdenes con:
  - Email del cliente (requerido, validación)
  - Nivel de cliente (STANDARD, GOLD, VIP)
  - Artículos dinámicos (nombre, cantidad, precio)
  - Validación: mínimo 1 artículo, cantidad > 0, precio > 0
  - Botón para agregar/eliminar artículos

### ✅ Encabezado

- Título: "OrderFlow"
- Descripción: "Gestiona tus órdenes de forma simple y eficiente"

### ✅ Estados de Aplicación

- Loading: Spinner mientras se cargan órdenes
- Error: Alerta con mensaje de error y opción de cerrar
- Success: Formulario se limpia después de crear orden

### ✅ Integración con Backend

- **GET /orders** — Listar órdenes
- **POST /orders** — Crear orden
- **POST /orders/:id/cancel** — Eliminar/cancelar orden

### ✅ Accesibilidad

- Labels asociados a inputs
- ARIA labels en botones
- Roles semánticos
- Navegación por teclado
- Mensajes de error con `aria-live`

### ✅ Responsive

- Dos columnas en desktop (1024px+)
- Una columna en tablet/mobile (<1024px)
- Escala de texto y espaciado adaptable

## Stack

- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool
- **CSS Modules** — Estilos scoped
- **Vitest + @testing-library/react** — Testing

## Criterios de Aceptación (Issue #2)

- ✅ La pantalla muestra el título `OrderFlow` en la parte superior
- ✅ Hay una descripción visible de la aplicación debajo del título
- ✅ La pantalla está dividida en dos paneles: izquierdo (lista) y derecho (crear/editar)
- ✅ La lista de órdenes muestra botones de **Editar** y **Eliminar** por cada ítem
- ✅ Al presionar **Editar**, el panel derecho se rellena con los datos de la orden seleccionada
- ✅ Al presionar **Eliminar**, la orden es removida de la lista (POST /cancel)

## Variables de Entorno

Crear archivo `.env.local` en `src/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Si no se define, usa `http://localhost:3000` por defecto.

## Próximas Mejoras

- [ ] Persistencia en LocalStorage para estado temporal
- [ ] Filtros por estado de orden
- [ ] Búsqueda por email
- [ ] Paginación de órdenes
- [ ] Modo oscuro
- [ ] Exportar órdenes a PDF/CSV
- [ ] Validaciones más avanzadas (regex de email, etc.)
- [ ] Confirmación antes de eliminar con modal
- [ ] Toast notifications
