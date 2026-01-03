# Dump Truck Rental & Operations Management System - Backend API

A secure, production-ready REST API for managing dump truck rentals, operations, and activity tracking.

## Features

- JWT-based authentication with HTTP-only cookies
- Role-based access control (ADMIN, MANAGER, DRIVER)
- Complete CRUD operations for users, drivers, trucks, contracts, schedules, and activities
- Schedule conflict prevention and availability checking
- Operations and efficiency reporting
- Request validation with Zod
- Rate limiting and security headers
- MySQL database with Prisma ORM

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, CORS, bcrypt, express-rate-limit
- **Cookie Management**: cookie-parser

## Prerequisites

- Node.js v18 or higher
- MySQL 8.0 or higher
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd truck
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Create MySQL database
```sql
CREATE DATABASE dump_truck_db;
```

5. Configure your `.env` file with your database credentials and secrets
```env
NODE_ENV=development
PORT=5000

# Database with connection pooling (5 connections max, 20s pool timeout)
DATABASE_URL="mysql://user:password@localhost:3306/dump_truck_db?connection_limit=5&pool_timeout=20&connect_timeout=10"

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:3000
```

6. **Quick Setup** (Recommended)
```bash
npm run setup
```
This will automatically run: generate → migrate → seed → verify

**OR Manual Setup:**

Generate Prisma Client
```bash
npm run prisma:generate
```

Run database migrations
```bash
npm run prisma:migrate
```

Seed the database
```bash
npm run prisma:seed
```

Verify setup
```bash
npm run verify
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`

## Prisma Configuration

### Connection Pooling
The application uses Prisma's built-in connection pooling with the following configuration:
- **Connection Limit**: 5 concurrent connections
- **Pool Timeout**: 20 seconds
- **Connect Timeout**: 10 seconds

### Singleton Pattern
PrismaClient is instantiated using a singleton pattern to:
- Prevent multiple instances in development (hot-reloading)
- Ensure proper connection management
- Optimize resource usage
- Enable graceful shutdown on SIGTERM/SIGINT

### Verification
Run the verification script to check your Prisma setup:
```bash
npm run verify
```

This will check:
- Database connection
- PrismaClient instantiation
- Database tables existence
- Connection pooling configuration
- Model accessibility
- Data presence

## Database Schema

### Models
- **User**: Authentication and user management
- **Driver**: Driver information and status
- **DumpTruck**: Truck fleet management
- **Contract**: Client contracts
- **Schedule**: Daily schedules linking contracts, trucks, and drivers
- **ActivityLog**: Driver activity submissions

### Relationships
- User → Driver (one-to-one, optional)
- Contract → Schedules (one-to-many)
- DumpTruck → Schedules (one-to-many)
- Driver → Schedules (one-to-many)
- Schedule → ActivityLogs (one-to-many)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email & password
- `POST /api/auth/logout` - Logout and clear cookie
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (Protected)

### Users (ADMIN only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Drivers (ADMIN, MANAGER)
- `GET /api/drivers` - List all drivers
- `POST /api/drivers` - Create driver
- `GET /api/drivers/:id` - Get driver details
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Dump Trucks (ADMIN, MANAGER)
- `GET /api/dump-trucks` - List all trucks
- `POST /api/dump-trucks` - Create truck
- `GET /api/dump-trucks/:id` - Get truck details
- `PUT /api/dump-trucks/:id` - Update truck
- `DELETE /api/dump-trucks/:id` - Delete truck

### Contracts (ADMIN, MANAGER)
- `GET /api/contracts` - List contracts (filter by status)
- `POST /api/contracts` - Create contract
- `GET /api/contracts/:id` - Get contract details
- `PUT /api/contracts/:id` - Update contract
- `DELETE /api/contracts/:id` - Delete contract

### Schedules
- `GET /api/schedules` - List schedules (drivers see only their own)
- `POST /api/schedules` - Create schedule (ADMIN, MANAGER)
- `GET /api/schedules/:id` - Get schedule details
- `PUT /api/schedules/:id` - Update schedule (ADMIN, MANAGER)
- `DELETE /api/schedules/:id` - Delete schedule (ADMIN, MANAGER)
- `GET /api/schedules/availability/check` - Check truck/driver availability

### Activity Logs
- `GET /api/activities` - List activities (ADMIN, MANAGER)
- `POST /api/activities` - Driver submits activity
- `GET /api/activities/:id` - Get activity details
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity (ADMIN, MANAGER)

### Reports (ADMIN, MANAGER)
- `GET /api/reports/operations?startDate=&endDate=&contractId=` - Operations report
- `GET /api/reports/efficiency` - Fleet efficiency metrics
- `GET /api/reports/export?format=pdf|excel&startDate=&endDate=` - Export report

## Default Users

After seeding, you can login with these credentials:

**Admin**
- Email: admin@dumptruck.com
- Password: password123

**Managers**
- Email: manager1@dumptruck.com / manager2@dumptruck.com
- Password: password123

**Drivers**
- Email: driver1@dumptruck.com / driver2@dumptruck.com / driver3@dumptruck.com
- Password: password123

## Business Rules

1. **Schedule Validation**
   - Cannot assign same dump truck to overlapping time periods
   - Cannot assign same driver to overlapping time periods
   - Schedule date must fall within contract period
   - Both dump truck and driver must have READY/ACTIVE status

2. **Activity Submission**
   - Drivers can only submit activities for their assigned schedules
   - Working hours must be positive number (> 0)
   - Activity submission automatically updates schedule status to COMPLETED
   - Dump truck status returns to READY after activity submission

3. **Contract Rules**
   - End date must be after start date
   - Cannot delete contract with active schedules
   - Deleting contract cancels all associated schedules

4. **User Management**
   - Cannot delete user if linked to driver with active schedules
   - Email must be unique
   - Password minimum 8 characters

## Security Features

- Helmet.js for security headers
- CORS configured for specific origins
- Rate limiting: 100 requests per 15 minutes per IP
- Bcrypt password hashing (10 salt rounds)
- JWT access tokens (15 minutes expiry)
- HTTP-only cookies for refresh tokens (7 days expiry)
- Role-based authorization on all protected routes

## Project Structure

```
src/
├── controllers/       # Request handlers
├── services/          # Business logic
├── routes/            # API route definitions
├── middlewares/       # Custom middleware
├── validations/       # Zod validation schemas
├── utils/             # Helper functions
├── prisma/            # Database schema and seed
├── config/            # Configuration files
├── app.js             # Express app setup
└── server.js          # Server entry point
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Development Tools

### Prisma Studio
View and edit your database:
```bash
npm run prisma:studio
```

### Database Migrations
Create a new migration:
```bash
npm run prisma:migrate
```

## Testing

Import the Postman collection (`Dump_Truck_API.postman_collection.json`) to test all endpoints.

## License

ISC
