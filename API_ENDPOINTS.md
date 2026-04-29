# Hotel App API Endpoints

Base URL: `http://localhost:3000`  
Swagger Documentation: `http://localhost:3000/api`  
Technologies: NestJS 11, TypeORM, PostgreSQL, JWT Authentication, Role-based Authorization

---

## Authentication

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "string (requerido, email válido)",
  "password": "string (requerido, min 6 chars)"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_user": 1,
    "full_name": "Admin User",
    "email": "admin@hotel.com",
    "role": "Administrator"
  }
}
```

### Using the JWT Token
Include the token in the Authorization header for all protected endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Roles disponibles
- **Administrator** - Acceso completo
- **Manager** - Gestión general (excepto eliminar usuarios/roles)
- **Receptionist** - Gestión de reservaciones y clientes
- **Client** - Solo consulta de habitaciones/servicios/promociones y crear sus propias reservaciones
- **Maintenance** - Mantenimiento (no implementado en endpoints actuales)

---

## Roles (Roles)
**Protegido:** Admin/Manager

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/roles` | Administrator, Manager | Crear nuevo rol |
| GET | `/roles` | Administrator, Manager | Obtener todos los roles |
| GET | `/roles/:id` | Administrator, Manager | Obtener rol por ID |
| PATCH | `/roles/:id` | Administrator, Manager | Actualizar rol |
| DELETE | `/roles/:id` | Administrator, Manager | Eliminar rol |

### CreateRoleDto (POST)
```json
{ "role_name": "string (requerido, max 50 chars, único)" }
```

---

## Users (Usuarios)
**Protegido:** Admin/Receptionist/Manager

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/users` | Administrator, Receptionist | Crear nuevo usuario |
| GET | `/users` | Administrator, Receptionist, Manager | Obtener todos los usuarios |
| GET | `/users/:id` | Administrator, Receptionist, Manager | Obtener usuario por ID |
| PATCH | `/users/:id` | Administrator, Receptionist | Actualizar usuario |
| DELETE | `/users/:id` | Administrator | Eliminar usuario |

### CreateUserDto (POST)
```json
{
  "full_name": "string (requerido, max 100 chars)",
  "email": "string (requerido, único, email válido)",
  "phone": "string (opcional, max 20 chars)",
  "password_hash": "string (requerido, min 6 chars)",
  "id_rol": "number (requerido, debe existir en tabla roles)",
  "is_active": "boolean (opcional, default: true)"
}
```

---

## Rooms (Habitaciones)
**Protegido:** Todos los usuarios autenticados pueden ver, Admin/Manager pueden modificar

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/rooms` | Administrator, Manager | Crear nueva habitación |
| GET | `/rooms` | Todos (autenticados) | Obtener todas las habitaciones |
| GET | `/rooms/:id` | Todos (autenticados) | Obtener habitación por ID |
| PATCH | `/rooms/:id` | Administrator, Manager | Actualizar habitación |
| DELETE | `/rooms/:id` | Administrator | Eliminar habitación |

### CreateRoomDto (POST)
```json
{
  "room_number": "string (requerido, único, max 10 chars)",
  "room_type": "string (requerido, valores: 'simple' | 'double' | 'suite' | 'family')",
  "floor": "number (requerido)",
  "price_per_night": "number (requerido, > 0)",
  "description": "string (opcional)",
  "capacity": "number (opcional, default: 2)",
  "square_meters": "number (opcional)",
  "has_view": "boolean (opcional, default: false)",
  "has_balcony": "boolean (opcional, default: false)",
  "room_status": "string (opcional, valores: 'available' | 'occupied' | 'maintenance' | 'reserved')"
}
```

---

## Reservations (Reservaciones)
**Protegido:** Client puede crear/ver sus reservas, Admin/Receptionist pueden gestionar todas

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/reservations` | Administrator, Receptionist, Client | Crear nueva reservación |
| GET | `/reservations` | Administrator, Receptionist, Manager | Obtener todas las reservaciones |
| GET | `/reservations/:id` | Todos (autenticados) | Obtener reservación por ID |
| PATCH | `/reservations/:id` | Administrator, Receptionist | Actualizar reservación |
| DELETE | `/reservations/:id` | Administrator, Receptionist | Eliminar reservación |

### CreateReservationDto (POST)
```json
{
  "id_client": "number (requerido, debe existir en tabla users)",
  "id_room": "number (requerido, debe existir en tabla rooms)",
  "check_in_date": "Date (requerido, formato ISO 8601)",
  "check_out_date": "Date (requerido, debe ser posterior a check_in_date)",
  "number_of_guests": "number (opcional, min 1, default: 1)",
  "reservation_status": "string (opcional, valores: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show')",
  "total_amount": "number (requerido, >= 0)",
  "notes": "string (opcional)"
}
```

---

## Occupancies (Ocupaciones)
**Protegido:** Admin/Receptionist

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/occupancies` | Administrator, Receptionist | Crear nueva ocupación |
| GET | `/occupancies` | Administrator, Receptionist, Manager | Obtener todas las ocupaciones |
| GET | `/occupancies/:id` | Administrator, Receptionist, Manager | Obtener ocupación por ID |
| PATCH | `/occupancies/:id` | Administrator, Receptionist | Actualizar ocupación |
| DELETE | `/occupancies/:id` | Administrator, Receptionist | Eliminar ocupación |

### CreateOccupancyDto (POST)
```json
{
  "id_reservation": "number (requerido, debe existir en tabla reservations)",
  "id_room": "number (requerido, debe existir en tabla rooms)",
  "actual_check_in": "Date (requerido, formato ISO 8601)",
  "actual_check_out": "Date (opcional)",
  "occupancy_status": "string (opcional, valores: 'active' | 'completed' | 'no_show')",
  "guest_signature": "string (opcional)"
}
```

---

## Services (Servicios)
**Protegido:** Todos pueden ver, Admin/Manager pueden modificar

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/services` | Administrator, Manager | Crear nuevo servicio |
| GET | `/services` | Todos (autenticados) | Obtener todos los servicios |
| GET | `/services/:id` | Todos (autenticados) | Obtener servicio por ID |
| PATCH | `/services/:id` | Administrator, Manager | Actualizar servicio |
| DELETE | `/services/:id` | Administrator | Eliminar servicio |

### CreateServiceDto (POST)
```json
{
  "service_name": "string (requerido, max 100 chars)",
  "description": "string (opcional)",
  "price": "number (requerido, >= 0)",
  "is_active": "boolean (opcional, default: true)"
}
```

---

## Promotions (Promociones)
**Protegido:** Todos pueden ver, Admin/Manager pueden modificar

| Método | Ruta | Rol requerido | Descripción |
|--------|------|---------------|-------------|
| POST | `/promotions` | Administrator, Manager | Crear nueva promoción |
| GET | `/promotions` | Todos (autenticados) | Obtener todas las promociones |
| GET | `/promotions/:id` | Todos (autenticados) | Obtener promoción por ID |
| PATCH | `/promotions/:id` | Administrator, Manager | Actualizar promoción |
| DELETE | `/promotions/:id` | Administrator | Eliminar promoción |

### CreatePromotionDto (POST)
```json
{
  "promotion_code": "string (requerido, único, max 50 chars)",
  "description": "string (opcional)",
  "discount_percent": "number (opcional, 0-100, no puede coexistir con discount_amount)",
  "discount_amount": "number (opcional, >= 0, no puede coexistir con discount_percent)",
  "start_date": "Date (requerido)",
  "end_date": "Date (requerido, debe ser posterior a start_date)",
  "min_nights": "number (opcional, min 1, default: 1)",
  "max_usage": "number (opcional, min 1)",
  "is_active": "boolean (opcional, default: true)"
}
```

---

## Ejemplo de flujo para el frontend

### 1. Login (obtener token)
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@hotel.com",
  "password": "password123"
}
```

### 2. Usar el token en siguientes requests
```bash
GET /rooms
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. El token expira en 24 horas
Si el token expira o es inválido, recibirás:
- **401 Unauthorized** - Token no proporcionado o inválido
- **403 Forbidden** - No tienes el rol necesario para acceder a este recurso

---

## Notas importantes para la IA del frontend

1. **Todas las fechas** se manejan en formato ISO 8601 (ej. `"2026-05-01T15:00:00Z"`)
2. **Los IDs** en las rutas (`:id`) se pasan como strings en la URL pero se convierten a números automáticamente
3. **Las validaciones** devuelven errores 400 con detalles de los campos inválidos
4. **Si un recurso no se encuentra**, se devuelve error 404
5. **Las relaciones** (como usuario -> rol, reservación -> cliente/habitación) se incluyen automáticamente en las respuestas GET
6. **Para probar la API**, usa la interfaz Swagger en `/api` que permite autorizar con el botón "Authorize" usando el JWT token
7. **El token JWT contiene:** `id_user`, `email`, `id_rol`, `role` (role_name)
8. **Los roles son validados** tanto en el backend como documentados en Swagger con `@ApiBearerAuth()`
