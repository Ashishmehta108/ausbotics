# AusBots Backend API Documentation

## Project Overview
This is a backend API for AusBots, built with Node.js, Express, and Prisma. The application provides user authentication, workflow management, and result tracking functionalities with role-based access control.

## Database Schema

The application uses the following main models:

1. **User**
   - id: String (UUID)
   - email: String (unique)
   - password: String (hashed)
   - role: Enum('USER', 'ADMIN', 'SUPERADMIN')
   - createdAt: DateTime
   - updatedAt: DateTime

2. **Workflow**
   - id: Int (auto-increment)
   - name: String
   - n8nId: String
   - isActive: Boolean
   - createdAt: DateTime
   - updatedAt: DateTime

3. **Result**
   - id: Int (auto-increment)
   - workflowId: Int (foreign key)
   - userId: String (foreign key)
   - data: Json
   - agentMessages: Json[]
   - callbackBooked: Boolean
   - leadName: String
   - createdAt: DateTime
   - updatedAt: DateTime

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header as `Bearer <token>`.

# API Routes Reference

## Authentication

### `POST /api/auth/signup`
Create a new user account.

**Endpoint:** `POST /api/auth/signup`  
**Authentication:** Not required  
**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "USER"
}
```
**Success Response (201 Created):**
```json
{
  "id": "user-uuid",
  "email": "newuser@example.com",
  "role": "USER",
  "createdAt": "2025-09-10T13:45:00.000Z"
}
```

### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Success Response (200 OK):**
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

## Users

### `GET /api/users`
Retrieve all users in the system.

**Endpoint:** `GET /api/users`  
**Authentication:** Required (Bearer Token)  
**Required Role:** ADMIN or SUPERADMIN  
**Success Response (200 OK):**
```json
[
  {
    "id": "user1-uuid",
    "email": "user1@example.com",
    "role": "USER",
    "createdAt": "2025-09-01T10:00:00.000Z"
  },
  {
    "id": "admin1-uuid",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2025-09-01T09:00:00.000Z"
  }
]
```

---

## Workflows

### `GET /api/workflows`
Get all workflows in the system.

**Endpoint:** `GET /api/workflows`  
**Authentication:** Required (Bearer Token)  
**Required Role:** USER, ADMIN, or SUPERADMIN  
**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Sample Workflow 1",
    "n8nId": "n8n_workflow_1",
    "isActive": true,
    "createdAt": "2025-09-01T10:00:00.000Z",
    "updatedAt": "2025-09-01T10:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Sample Workflow 2",
    "n8nId": "n8n_workflow_2",
    "isActive": false,
    "createdAt": "2025-09-02T11:00:00.000Z",
    "updatedAt": "2025-09-02T11:00:00.000Z"
  }
]
```

### `POST /api/workflows/:id/activate`
Activate a specific workflow.

**Endpoint:** `POST /api/workflows/:id/activate`  
**Authentication:** Required (Bearer Token)  
**Required Role:** SUPERADMIN  
**URL Parameters:**
- `id` (required): The ID of the workflow to activate

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Sample Workflow 1",
  "isActive": true,
  "updatedAt": "2025-09-10T14:30:00.000Z"
}
```

### `POST /api/workflows/:id/deactivate`
Deactivate a specific workflow.

**Endpoint:** `POST /api/workflows/:id/deactivate`  
**Authentication:** Required (Bearer Token)  
**Required Role:** SUPERADMIN  
**URL Parameters:**
- `id` (required): The ID of the workflow to deactivate

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Sample Workflow 1",
  "isActive": false,
  "updatedAt": "2025-09-10T15:00:00.000Z"
}
```

---

## Results

### `GET /api/results`
Retrieve all results.

**Endpoint:** `GET /api/results`  
**Authentication:** Required (Bearer Token)  
**Required Role:** USER, ADMIN, or SUPERADMIN  
**Query Parameters:**
- `workflowId` (optional): Filter results by workflow ID
- `userId` (optional): Filter results by user ID
- `status` (optional): Filter by status
- `callbackBooked` (optional): Filter by callback status

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "workflowId": 1,
    "userId": "user1-uuid",
    "data": {
      "lead": "John Doe",
      "status": "new",
      "agentMessages": ["Initial contact"],
      "callbackBooked": false
    },
    "callbackBooked": false,
    "leadName": "John Doe",
    "createdAt": "2025-09-10T10:00:00.000Z",
    "updatedAt": "2025-09-10T10:00:00.000Z"
  }
]
```

### `POST /api/results`
Create a new result entry.

**Endpoint:** `POST /api/results`  
**Authentication:** Required (Bearer Token)  
**Required Role:** USER  
**Request Body:**
```json
{
  "workflowId": 1,
  "data": {
    "lead": "John Smith",
    "status": "new",
    "agentMessages": ["Initial contact"],
    "callbackBooked": false
  }
}
```
**Success Response (201 Created):**
```json
{
  "id": 2,
  "workflowId": 1,
  "userId": "user1-uuid",
  "data": {
    "lead": "John Smith",
    "status": "new",
    "agentMessages": ["Initial contact"],
    "callbackBooked": false
  },
  "callbackBooked": false,
  "leadName": "John Smith",
  "createdAt": "2025-09-10T16:00:00.000Z",
  "updatedAt": "2025-09-10T16:00:00.000Z"
}
```

### `GET /api/results/:id`
Get a specific result by ID.

**Endpoint:** `GET /api/results/:id`  
**Authentication:** Required (Bearer Token)  
**Required Role:** USER, ADMIN, or SUPERADMIN  
**URL Parameters:**
- `id` (required): The ID of the result to retrieve

**Success Response (200 OK):**
```json
{
  "id": 1,
  "workflowId": 1,
  "userId": "user1-uuid",
  "data": {
    "lead": "John Doe",
    "status": "new",
    "agentMessages": ["Initial contact"],
    "callbackBooked": false
  },
  "callbackBooked": false,
  "leadName": "John Doe",
  "createdAt": "2025-09-10T10:00:00.000Z",
  "updatedAt": "2025-09-10T10:00:00.000Z"
}
```

### `PUT /api/results/:id`
Update a specific result.

**Endpoint:** `PUT /api/results/:id`  
**Authentication:** Required (Bearer Token)  
**Required Role:** SUPERADMIN  
**URL Parameters:**
- `id` (required): The ID of the result to update

**Request Body:**
```json
{
  "data": {
    "status": "contacted",
    "agentMessages": ["Initial contact", "Follow up sent"],
    "callbackBooked": true
  }
}
```
**Success Response (200 OK):**
```json
{
  "id": 1,
  "workflowId": 1,
  "userId": "user1-uuid",
  "data": {
    "lead": "John Doe",
    "status": "contacted",
    "agentMessages": ["Initial contact", "Follow up sent"],
    "callbackBooked": true
  },
  "callbackBooked": true,
  "leadName": "John Doe",
  "createdAt": "2025-09-10T10:00:00.000Z",
  "updatedAt": "2025-09-10T17:00:00.000Z"
}
```

### `DELETE /api/results/:id`
Delete a specific result.

**Endpoint:** `DELETE /api/results/:id`  
**Authentication:** Required (Bearer Token)  
**Required Role:** SUPERADMIN  
**URL Parameters:**
- `id` (required): The ID of the result to delete

**Success Response (204 No Content)**

---

## Dummy Endpoint

### `GET /api/dummy`
A test endpoint that returns sample data.

**Endpoint:** `GET /api/dummy`  
**Authentication:** Required (Bearer Token)  
**Required Role:** Any authenticated user  
**Success Response (200 OK):**
```json
{
  "message": "Dummy data",
  "timestamp": "2025-09-10T18:00:00.000Z"
}
```

## Setup and Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env` and update values)

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Seed the database:
   ```bash
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Testing the API

Use the provided `ausbots-api.http` file with REST Client extension in VS Code to test all endpoints. The file includes pre-configured requests with example data.

## Authentication Flow

1. Login with valid credentials to get a JWT token
2. Include the token in the `Authorization` header for subsequent requests
3. The token will expire after a set period (configurable in `.env`)

## Error Handling

The API returns appropriate HTTP status codes and error messages in the following format:

```json
{
  "status": "error",
  "message": "Error description",
  "details": {}
}
```

## Rate Limiting

API rate limiting is implemented to prevent abuse. The default limit is 100 requests per 15 minutes per IP address.

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are signed with a secret key
- Role-based access control for all endpoints
- Input validation on all endpoints
- CORS is configured to allow requests only from trusted origins

## Dependencies

- Express.js - Web framework
- Prisma - ORM for database operations
- JSON Web Tokens - For authentication
- bcrypt - For password hashing
- dotenv - For environment variable management
- cors - For handling Cross-Origin Resource Sharing
