# Quick Start Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartrent360?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   NODE_ENV=development
   API_VERSION=v1
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Create database migration
   npm run prisma:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing the API

### 1. Register a User
```bash
POST http://localhost:3000/api/v1/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+250788123456",
  "password": "password123",
  "role": "TENANT",
  "nationalId": "1234567890123456"
}
```

### 2. Login
```bash
POST http://localhost:3000/api/v1/users/login
Content-Type: application/json

{
  "phone": "+250788123456",
  "password": "password123"
}
```

Response will include a JWT token. Use this token in the Authorization header for protected routes:
```
Authorization: Bearer <your-jwt-token>
```

### 3. Create a Property (as Landlord)
First, register as a LANDLORD, then:
```bash
POST http://localhost:3000/api/v1/properties
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Beautiful 3 Bedroom House",
  "type": "HOUSE",
  "price": 500000,
  "location": "Kigali, Rwanda",
  "rooms": 3
}
```

### 4. Search Properties
```bash
GET http://localhost:3000/api/v1/properties?type=HOUSE&minPrice=100000&maxPrice=1000000&page=1&pageSize=10
```

### 5. Submit a Request (as Tenant)
```bash
POST http://localhost:3000/api/v1/requests
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "propertyId": "<property-id>",
  "message": "I'm interested in this property"
}
```

## API Documentation

Once the server is running, access Swagger documentation at:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health

## Common Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code
```

## Creating an Admin User

To create an admin user, you can either:

1. **Use Prisma Studio**:
   ```bash
   npm run prisma:studio
   ```
   Then manually create a user with role `ADMIN` in the database.

2. **Use a database seed script** (create `prisma/seed.ts`):
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import bcrypt from 'bcryptjs';
   
   const prisma = new PrismaClient();
   
   async function main() {
     const hashedPassword = await bcrypt.hash('admin123', 10);
     const admin = await prisma.user.create({
       data: {
         name: 'Admin User',
         phone: '+250788000000',
         password: hashedPassword,
         role: 'ADMIN',
         verified: true,
       },
     });
     console.log('Admin user created:', admin);
   }
   
   main()
     .catch(console.error)
     .finally(() => prisma.$disconnect());
   ```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` file
- Verify database exists: `createdb smartrent360`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port

### Prisma Client Not Generated
- Run `npm run prisma:generate`
- Ensure `@prisma/client` is installed

### Migration Issues
- Reset database: `npx prisma migrate reset` (WARNING: deletes all data)
- Or create a new migration: `npx prisma migrate dev --name <migration-name>`

