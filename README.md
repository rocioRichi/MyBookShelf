# Prueba Técnica – BookShelf

## Contexto

En **Borah Digital Labs** necesitamos una interfaz ligera para que los editores gestionen el catálogo digital.  
Queremos evaluar tu capacidad para construir un **CRUD completo, limpio y escalable** usando **Vue 3**, **TypeScript** y una **API “mock”** basada en **JSON Server** (no debes programar back-end real).

---

## Enunciado general

Crea **“BookShelf”**, una SPA que permita administrar un inventario de libros:

### 1. Listado de Libros (`/books`)

- Tabla paginada (10 ítems/página).
- Búsqueda por título y autor.
- Orden asc/desc por título, fecha de publicación y stock.

### 2. Crear Libro (`/books/new`)

- Campos: título, autor, fecha publicación, categoría (elige opciones fijas) y stock disponible.
- Validaciones en tiempo real y al enviar:
  - Fecha ≤ hoy
  - Texto ≥ 3 caracteres

### 3. Editar Libro (`/books/:id/edit`)

- Mismos campos pre-cargados.
- Botones **Guardar** y **Descartar** (con modal de confirmación).

### 4. Ver Detalle (`/books/:id`)

- Muestra toda la información.
- Botones **Editar** y **Eliminar**.

### 5. Eliminar Libro

- Confirmación modal obligatoria.

---

## Persistencia con JSON Server

La prueba es exclusivamente **front-end**. JSON Server te da una API REST completa en minutos.

### ¿Qué es JSON Server?

Una librería NPM que lee un archivo `db.json` y expone rutas RESTful (GET/POST/PUT/PATCH/DELETE) sin escribir código back-end.

### Pasos de uso

1. Instalar como dependencia de desarrollo:
   ```bash
   npm i -D json-server
   ```
