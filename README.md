# SmartRent360 Backend

A comprehensive backend API for a property rental management system built with **TypeScript**, **Express.js**, **PostgreSQL**, and **Prisma**.

---

## ✨ Features

- **User Management** – Registration, authentication, role-based access control (Tenant, Landlord, Commissioner, Admin)
- **Property Management** – CRUD operations, verification, and media handling
- **Tenant Requests** – Submission and management of property interest requests
- **Commission Tracking** – Automatic calculation of service fees
- **Admin Functions** – Verification, dashboard, and statistics
- **Search & Filtering** – Filter by type, location, price, rooms
- **Pagination** – All list endpoints are paginated
- **Security** – JWT authentication, role-based access, input validation
- **API Documentation** – Swagger/OpenAPI integration

---

## 🧱 Technology Stack

- **Language**: TypeScript  
- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Database**: PostgreSQL  
- **ORM**: Prisma  
- **Authentication**: JWT + Role-based access control  
- **Documentation**: Swagger (OpenAPI)

---

## 📁 Project Structure

```
/src
  /config        # Database, environment variables, JWT secrets
  /models        # TypeScript types/interfaces for entities
  /repositories  # Prisma access layer (CRUD, search, pagination)
  /services      # Business logic layer
  /controllers   # API route handlers
  /routes        # Express route definitions
  /middlewares   # Auth, validation, error handling, RBAC
  /utils         # Helpers (pagination, responses, localization)
  /types         # Shared enums, DTOs, ApiResponse types
  /docs          # Swagger/OpenAPI YAML or JSON
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

---

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd smartRent360_backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartrent360?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   API_VERSION=v1
   ```

4. **Set up the database:**

   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The server will start at **http://localhost:3000**

---

## 📘 API Documentation

Once the server is running, access:

- **Swagger UI** → [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
- **Health Check** → [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🔗 API Endpoints

### 👤 User Module

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/v1/users/register` | Register a new user |
| POST | `/v1/users/login` | Authenticate user and get JWT |
| GET | `/v1/users/:id` | Get user details (authenticated) |
| PATCH | `/v1/users/:id/verify` | Verify user (Admin only) |
| GET | `/v1/users/pending/verification` | Get pending users (Admin only) |

---

### 🏘️ Property Module

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/v1/properties` | Create property listing |
| GET | `/v1/properties` | Search/list properties with filters |
| GET | `/v1/properties/:id` | Get property details |
| PATCH | `/v1/properties/:id` | Update property |
| PATCH | `/v1/properties/:id/verify` | Verify property (Admin only) |
| GET | `/v1/properties/pending/verification` | Get pending properties (Admin only) |

---

### 📩 Request Module

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/v1/requests` | Submit interest request |
| GET | `/v1/requests` | Get all requests with filters |
| GET | `/v1/requests/:id` | Get request details |
| PATCH | `/v1/requests/:id/connect` | Connect tenant to landlord (Admin only) |
| PATCH | `/v1/requests/:id/complete` | Mark request as completed (Admin only) |

---

### 💰 Commission Module

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/v1/commissions` | Record commission |
| GET | `/v1/commissions` | Get all commissions |
| GET | `/v1/commissions/:id` | Get commission details |

---

### 🛠️ Admin Module

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/v1/admin/stats` | Get platform statistics (Admin only) |

---

## 🔐 Authentication

Most endpoints require a JWT token in the **Authorization** header:

```bash
Authorization: Bearer <your-jwt-token>
```

---

## 📦 Response Format

### ✅ Success Response

```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { }
}
```

### 📄 Paginated Response

```json
{
  "status": "success",
  "message": "Data retrieved",
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

### ❌ Error Response

```json
{
  "status": "error",
  "message": "Error message",
  "errors": {
    "field": "Error details"
  }
}
```

---

## 🧩 Development Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🗃️ Database Migrations

```bash
# Create a new migration
npm run prisma:migrate

# View database in Prisma Studio
npm run prisma:studio
```

---

## 🏗️ Architecture Overview

1. **Repositories** – Handle all database operations via Prisma  
2. **Services** – Implement business logic and validation  
3. **Controllers** – Handle HTTP requests and responses  
4. **Routes** – Define API endpoints and middleware  
5. **Middlewares** – Authentication, authorization, validation, error handling  

---

## 🔒 Security

- JWT-based authentication  
- Role-based access control (RBAC)  
- Password hashing with bcrypt  
- Input validation using express-validator  
- Environment variables for sensitive configuration  

---

## 🤝 Contributing

1. Follow the existing code structure  
2. Maintain strict TypeScript typing  
3. Write clean, modular, maintainable code  
4. Document all endpoints in Swagger  
5. Follow the Repository → Service → Controller pattern  

---

## 📜 License

**ISC License**  
© SmartRent360 Team

---
