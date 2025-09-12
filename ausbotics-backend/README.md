# AusBotics Backend API

A backend service for managing workflows, results, and user authentication. This system provides a robust API for workflow automation, user management, and result tracking with role-based access control.

## Key Features
- **User Authentication & Authorization** - Secure JWT-based auth with role-based access control
- **Workflow Management** - Create, activate, and manage automated workflows
- **Result Tracking** - Track and monitor workflow execution status and progress
- **Google Sheets Integration** - Export and sync data with Google Sheets
- **n8n Integration** - Connect with n8n workflow automation

## Table of Contents
1. [API Documentation](#api-documentation)
   - [Authentication](#authentication)
   - [Users](#users)
   - [Workflows](#workflows)
   - [Results](#results)
2. [Authentication & Authorization](#authentication--authorization)
3. [Error Handling](#error-handling)
4. [Environment Variables](#environment-variables)
5. [Database Schema](#database-schema)
6. [Setup & Installation](#setup--installation)
7. [Development](#development)

## API Documentation

### Authentication

#### POST /api/auth/signup
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "USER" // Optional, defaults to "USER"
}
```

**Response:**
```json
{
  "accessToken": "jwt.token.here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Authenticates a user and returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "accessToken": "jwt.token.here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Users

#### GET /api/users
Retrieves all users (Admin/SuperAdmin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "user1-id",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "user2-id",
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2023-01-02T00:00:00.000Z"
  }
]
```

### Workflows

#### GET /api/workflows
Retrieves all workflows.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "workflow1-id",
    "name": "Data Processing",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/workflows/:id/activate
Activates a workflow (SuperAdmin only). This will change the workflow's status to 'Processing' and trigger the associated n8n workflow.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Workflow activated",
  "workflow": {
    "id": "workflow1-id",
    "name": "Data Processing",
    "isActive": true,
    "n8nId": "n8n-workflow-id",
    "status": "Processing",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### GET /api/workflows/:id
Retrieves details of a specific workflow including its current status and results.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "workflow1-id",
  "name": "Data Processing",
  "isActive": true,
  "n8nId": "n8n-workflow-id",
  "status": "Processing",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "results": [
    {
      "id": "result1-id",
      "progress": 75,
      "status": "Processing",
      "createdAt": "2023-01-01T01:00:00.000Z"
    }
  ]
}
```

#### POST /api/workflows/:id/deactivate
Deactivates a workflow (SuperAdmin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Workflow deactivated"
}
```

### Results

#### GET /api/results
Retrieves results. Regular users only see their own results, while admins see all.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
[
  {
    "id": "result1-id",
    "workflowId": "workflow1-id",
    "userId": "user1-id",
    "progress": 75,
    "data": "{\"key\":\"value\"}",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### POST /api/results
Creates a new result entry for a workflow. This is typically called by the workflow automation system to track progress and store output data.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "workflowId": "workflow1-id",
  "progress": 25,
  "status": "Processing",
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Response:**
```json
{
  "id": "result1-id",
  "workflowId": "workflow1-id",
  "userId": "user1-id",
  "progress": 25,
  "status": "Processing",
  "data": "{\"key1\":\"value1\",\"key2\":\"value2\"}",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "workflow": {
    "id": "workflow1-id",
    "name": "Data Processing"
  },
  "user": {
    "id": "user1-id",
    "email": "user@example.com"
  }
}
```

### PATCH /api/results/:id
Updates an existing result, typically to update progress or status.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "progress": 75,
  "status": "Processing",
  "data": {
    "additionalData": "updated value"
  }
}
```

**Response:**
```json
{
  "id": "result1-id",
  "progress": 75,
  "status": "Processing",
  "message": "Result updated successfully"
}
```

## Authentication & Authorization

### Authentication
- Uses JWT (JSON Web Tokens) for authentication
- Access tokens are sent in the `Authorization` header
- Refresh tokens are stored in HTTP-only cookies

### User Roles
- `USER`: Regular user with basic access
- `ADMIN`: Administrative access (can view all users)
- `SUPERADMIN`: Full system access (can manage workflows)

## Error Handling

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error message",
  "statusCode": 400
}
```

## Environment Variables

The following environment variables should be set in a `.env` file:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="mongodb://localhost:27017/ausbots"

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=7d

# n8n Integration
N8N_BASE_URL="http://localhost:5678"

# Google Sheets API (for data export)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@example.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

## Workflow Lifecycle

1. **Creation**: A workflow is created with status 'Pending'
2. **Activation**: When activated, status changes to 'Processing' and the associated n8n workflow is triggered
3. **Execution**: The workflow processes data, updating progress and status
4. **Completion**: When finished, status changes to 'Completed' and results are stored
5. **Deactivation**: The workflow can be deactivated to prevent further execution

## Database Schema

### User
```prisma
model User {
  id           String   @id @map("_id") @default(auto()) @db.ObjectId
  email        String   @unique
  password     String
  role         Role     @default(USER)
  refreshToken String?  
  createdAt    DateTime @default(now())
  results      Result[]
}
```

### Result
```prisma
model Result {
  id         String   @id @map("_id") @default(auto()) @db.ObjectId
  workflowId String   @db.ObjectId
  userId     String   @db.ObjectId
  progress   Int      // percentage (0-100)
  data       String   
  createdAt  DateTime @default(now())
  workflow   Workflow @relation(fields: [workflowId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
}
```

### Enums

#### Role
```prisma
enum Role {
  USER
  ADMIN
  SUPERADMIN
}
```

#### Status
```prisma
enum Status {
  Pending
  Processing
  Completed
}
```

### Workflow
```prisma
model Workflow {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  name      String   @unique
  isActive  Boolean  @default(false)
  n8nId     String
  status    Status   @default(Pending)
  createdAt DateTime @default(now())
  results   Result[]
}
```

## Setup & Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see [Environment Variables](#environment-variables))
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Prerequisites
- Node.js (v14 or later)
- MongoDB (running locally or remote)
- npm or yarn

### Available Scripts
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the application
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Sync database schema

### Linting
```bash
npm run lint
```

## License
[MIT](LICENSE)
