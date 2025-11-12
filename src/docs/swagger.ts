import swaggerJsdoc from 'swagger-jsdoc';
// import { config } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartRent360 Backend API',
      version: '1.0.0',
      description: 'Property rental management system API documentation',
      contact: {
        name: 'SmartRent360 API Support',
      },
    },
    servers: [
      {
        // url: `http://localhost:${config.port}`,
        url: `https://smartrent360-backend.onrender.com/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success', 'error'],
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
            errors: {
              type: 'object',
            },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                pageSize: { type: 'number' },
                totalItems: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'COMMISSIONER', 'LANDLORD', 'TENANT'] },
            verified: { type: 'boolean' },
            nationalId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Property: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            type: { type: 'string', enum: ['HOUSE', 'APARTMENT', 'PLOT', 'ROOM'] },
            price: { type: 'integer' },
            location: { type: 'string' },
            rooms: { type: 'integer', nullable: true },
            status: { type: 'string', enum: ['AVAILABLE', 'RENTED', 'SOLD'] },
            verified: { type: 'boolean' },
            ownerId: { type: 'string', format: 'uuid' },
            owner: { $ref: '#/components/schemas/User' },
            media: {
              type: 'array',
              items: { $ref: '#/components/schemas/Media' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Media: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            propertyId: { type: 'string', format: 'uuid' },
            url: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Request: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            tenantId: { type: 'string', format: 'uuid' },
            tenant: { $ref: '#/components/schemas/User' },
            propertyId: { type: 'string', format: 'uuid' },
            property: { $ref: '#/components/schemas/Property' },
            adminId: { type: 'string', format: 'uuid', nullable: true },
            status: { type: 'string', enum: ['PENDING', 'CONNECTED', 'COMPLETED'] },
            message: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Commission: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            propertyId: { type: 'string', format: 'uuid' },
            property: { $ref: '#/components/schemas/Property' },
            commissionerId: { type: 'string', format: 'uuid' },
            commissioner: { $ref: '#/components/schemas/User' },
            amount: { type: 'integer' },
            smartRentFee: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['phone', 'password'],
          properties: {
            phone: { type: 'string', example: '+250788123456' },
            password: { type: 'string', format: 'password', example: 'password123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'phone', 'password', 'role'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            phone: { type: 'string', example: '+250788123456' },
            password: { type: 'string', format: 'password', example: 'password123', minLength: 6 },
            role: { type: 'string', enum: ['TENANT', 'LANDLORD', 'COMMISSIONER'], example: 'TENANT' },
            nationalId: { type: 'string', example: '1234567890123456' },
          },
        },
        CreatePropertyRequest: {
          type: 'object',
          required: ['title', 'type', 'price', 'location'],
          properties: {
            title: { type: 'string', example: 'Beautiful 3 Bedroom House' },
            type: { type: 'string', enum: ['HOUSE', 'APARTMENT', 'PLOT', 'ROOM'], example: 'HOUSE' },
            price: { type: 'integer', example: 500000, minimum: 0 },
            location: { type: 'string', example: 'Kigali, Rwanda' },
            rooms: { type: 'integer', example: 3, minimum: 0 },
          },
        },
        UpdatePropertyRequest: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Beautiful 3 Bedroom House' },
            type: { type: 'string', enum: ['HOUSE', 'APARTMENT', 'PLOT', 'ROOM'] },
            price: { type: 'integer', minimum: 0 },
            location: { type: 'string' },
            rooms: { type: 'integer', minimum: 0 },
            status: { type: 'string', enum: ['AVAILABLE', 'RENTED', 'SOLD'] },
          },
        },
        CreateRequestRequest: {
          type: 'object',
          required: ['propertyId'],
          properties: {
            propertyId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            message: { type: 'string', example: 'I am interested in this property' },
          },
        },
        CreateCommissionRequest: {
          type: 'object',
          required: ['propertyId', 'commissionerId', 'amount'],
          properties: {
            propertyId: { type: 'string', format: 'uuid' },
            commissionerId: { type: 'string', format: 'uuid' },
            amount: { type: 'integer', minimum: 0, example: 50000 },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Data retrieved successfully' },
            data: {
              type: 'array',
              items: { type: 'object' },
            },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 },
                totalItems: { type: 'number', example: 100 },
                totalPages: { type: 'number', example: 10 },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
        AdminStats: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number', example: 150 },
            totalProperties: { type: 'number', example: 75 },
            totalRequests: { type: 'number', example: 200 },
            totalCommissions: { type: 'number', example: 50 },
            pendingUsers: { type: 'number', example: 10 },
            pendingProperties: { type: 'number', example: 5 },
            pendingRequests: { type: 'number', example: 25 },
            totalCommissionAmount: { type: 'number', example: 2500000 },
            totalSmartRentFee: { type: 'number', example: 125000 },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management endpoints (registration, login, verification)',
      },
      {
        name: 'Properties',
        description: 'Property management endpoints (CRUD operations, search, verification)',
      },
      {
        name: 'Requests',
        description: 'Tenant request endpoints (submit interest, manage requests)',
      },
      {
        name: 'Commissions',
        description: 'Commission tracking endpoints',
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints (statistics, verification)',
      },
      {
        name: 'Health',
        description: 'Health check endpoint',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

