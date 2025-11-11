# Swagger/OpenAPI Documentation

## Overview

All API endpoints are now fully documented with Swagger/OpenAPI. The documentation is accessible at:

**URL:** `http://localhost:3000/api-docs`

## What Was Documented

### ✅ User Endpoints (5 endpoints)
1. **POST /v1/users/register** - Register a new user
2. **POST /v1/users/login** - Authenticate user and get JWT token
3. **GET /v1/users/{id}** - Get user details by ID
4. **PATCH /v1/users/{id}/verify** - Verify a user account (Admin only)
5. **GET /v1/users/pending/verification** - Get all users pending verification (Admin only)

### ✅ Property Endpoints (6 endpoints)
1. **GET /v1/properties** - Search and list properties with filters
2. **GET /v1/properties/{id}** - Get property details by ID
3. **POST /v1/properties** - Create a new property listing
4. **PATCH /v1/properties/{id}** - Update property details
5. **PATCH /v1/properties/{id}/verify** - Verify a property listing (Admin only)
6. **GET /v1/properties/pending/verification** - Get all properties pending verification (Admin only)

### ✅ Request Endpoints (5 endpoints)
1. **POST /v1/requests** - Submit interest request for a property
2. **GET /v1/requests** - Get all requests with filters
3. **GET /v1/requests/{id}** - Get request details by ID
4. **PATCH /v1/requests/{id}/connect** - Connect tenant to landlord/commissioner (Admin only)
5. **PATCH /v1/requests/{id}/complete** - Mark a request as completed (Admin only)

### ✅ Commission Endpoints (3 endpoints)
1. **POST /v1/commissions** - Record commission for a completed property deal
2. **GET /v1/commissions** - Get all commissions with filters
3. **GET /v1/commissions/{id}** - Get commission details by ID

### ✅ Admin Endpoints (1 endpoint)
1. **GET /v1/admin/stats** - Get platform statistics (Admin only)

### ✅ Health Check (1 endpoint)
1. **GET /api/health** - Health check endpoint

## Documentation Features

### For Each Endpoint:
- ✅ **Summary & Description** - Clear explanation of what the endpoint does
- ✅ **HTTP Method & URL** - Method and full path
- ✅ **Parameters** - All query, path, and body parameters with types and descriptions
- ✅ **Request Body** - Schema definitions for request bodies
- ✅ **Responses** - Success and error responses with status codes
- ✅ **Security** - Authentication requirements (JWT bearer token)
- ✅ **Role Requirements** - Admin-only endpoints clearly marked
- ✅ **Examples** - Example values for all fields
- ✅ **Pagination** - Pagination parameters and response format

### Schema Definitions:
- ✅ User schema
- ✅ Property schema (with owner and media)
- ✅ Request schema (with tenant and property)
- ✅ Commission schema (with property and commissioner)
- ✅ Media schema
- ✅ Request/Response DTOs
- ✅ Error response schema
- ✅ Paginated response schema
- ✅ Admin stats schema

## How to Access

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Open Swagger UI:**
   - Navigate to: `http://localhost:3000/api-docs`
   - You'll see all endpoints organized by tags

3. **Try the API:**
   - Click on any endpoint to expand it
   - Click "Try it out" to test the endpoint
   - Fill in parameters and click "Execute"
   - See the response below

## Authentication in Swagger

1. **Login first:**
   - Use `POST /v1/users/login` to get a JWT token
   - Copy the token from the response

2. **Authorize:**
   - Click the "Authorize" button at the top of the Swagger UI
   - Enter: `Bearer <your-token>`
   - Click "Authorize"
   - Now you can test protected endpoints

## Frontend Developer Benefits

### Easy Integration:
- ✅ **Clear API contracts** - Know exactly what to send and receive
- ✅ **Request/Response examples** - Copy-paste examples for quick testing
- ✅ **Parameter validation** - See required fields and formats
- ✅ **Error handling** - Know all possible error responses
- ✅ **Authentication flow** - Clear JWT authentication process

### Code Generation:
- ✅ **OpenAPI spec** - Can generate client SDKs
- ✅ **Type definitions** - Generate TypeScript interfaces
- ✅ **Mock servers** - Test frontend without backend

## Example Usage

### Register a User:
```json
POST /v1/users/register
{
  "name": "John Doe",
  "phone": "+250788123456",
  "password": "password123",
  "role": "TENANT",
  "nationalId": "1234567890123456"
}
```

### Search Properties:
```
GET /v1/properties?type=HOUSE&minPrice=100000&maxPrice=1000000&page=1&pageSize=10
```

### Create Property (Authenticated):
```json
POST /v1/properties
Authorization: Bearer <token>
{
  "title": "Beautiful 3 Bedroom House",
  "type": "HOUSE",
  "price": 500000,
  "location": "Kigali, Rwanda",
  "rooms": 3
}
```

## Tags Organization

Endpoints are organized by tags:
- **Users** - User management
- **Properties** - Property management
- **Requests** - Tenant requests
- **Commissions** - Commission tracking
- **Admin** - Admin functions
- **Health** - Health check

## Next Steps for Frontend

1. **Review all endpoints** in Swagger UI
2. **Test authentication flow** (register → login → use token)
3. **Test each endpoint** with sample data
4. **Generate TypeScript types** from OpenAPI spec (optional)
5. **Implement API client** using the documented contracts

## Maintenance

When adding new endpoints:
1. Add JSDoc comments above the route handler
2. Follow the existing documentation format
3. Include all parameters, responses, and examples
4. Test in Swagger UI to verify documentation

## Notes

- All endpoints follow RESTful conventions
- All responses follow the standardized `ApiResponse` format
- Pagination is consistent across all list endpoints
- Error responses are standardized
- Authentication is required for most endpoints (except public ones)

---

**Documentation is complete and ready for frontend development!** 🎉

