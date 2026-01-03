# Prisma Setup Documentation

## Overview
This document describes the Prisma configuration and optimizations implemented in the Dump Truck Management API.

## Setup Type
- **Module System**: CommonJS (using `require()` and `module.exports`)
- **Generator**: `prisma-client-js` (standard Prisma Client)
- **Database**: MySQL with connection pooling

## Key Features

### 1. Singleton Pattern Implementation
**Location**: [src/config/database.js](src/config/database.js)

The PrismaClient is instantiated using a singleton pattern to ensure:
- Only one instance exists throughout the application lifecycle
- Prevention of multiple instances during development hot-reloading
- Proper resource management and connection pooling

```javascript
// Production: Single instance
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ ... });
}
// Development: Prevents hot-reload duplication
else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ ... });
  }
  prisma = global.prisma;
}
```

### 2. Connection Pooling
**Configuration**: Added to `DATABASE_URL` in `.env`

```
DATABASE_URL="mysql://user:pass@localhost:3306/dump_truck_db?connection_limit=5&pool_timeout=20&connect_timeout=10"
```

**Parameters**:
- `connection_limit=5`: Maximum 5 concurrent database connections
- `pool_timeout=20`: 20-second timeout for acquiring connection from pool
- `connect_timeout=10`: 10-second timeout for initial connection

**Benefits**:
- Prevents connection exhaustion
- Optimizes resource usage
- Improves application performance under load
- Prevents database connection leaks

### 3. Graceful Shutdown
Implemented in [src/config/database.js](src/config/database.js)

```javascript
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

**Handles**:
- `SIGTERM`: Graceful shutdown signal
- `SIGINT`: Interrupt signal (Ctrl+C)
- `beforeExit`: Node.js exit event

**Purpose**: Ensures all database connections are properly closed before application shutdown.

### 4. Environment-Based Logging
```javascript
log: process.env.NODE_ENV === 'development'
  ? ['query', 'error', 'warn']  // Verbose in development
  : ['error']                    // Minimal in production
```

**Development**: Shows all queries, errors, and warnings
**Production**: Shows only errors for performance

### 5. Centralized Database Configuration
All services import from a single source:
```javascript
const prisma = require('../config/database');
```

**Benefits**:
- Single source of truth
- Easy to update configuration
- Consistent across all modules
- Simplifies testing and mocking

## Verification

### Setup Verification Script
**Location**: [scripts/verify-setup.js](scripts/verify-setup.js)

Run verification:
```bash
npm run verify
```

**Checks Performed**:
1. Database connection status
2. PrismaClient instantiation
3. Database tables existence
4. Connection pooling configuration
5. Model accessibility
6. Data presence (record counts)

**Output Example**:
```
=================================
Prisma Setup Verification
=================================

1. Testing database connection...
   ✓ Database connection successful

2. Verifying Prisma Client...
   ✓ Prisma Client instantiated correctly
   ✓ Environment: development

3. Checking database tables...
   ✓ Found 6 tables:
     - users
     - drivers
     - dump_trucks
     - contracts
     - schedules
     - activity_logs

4. Testing connection pooling...
   ✓ Max connections: 151
   ✓ Current connections: 2
   ✓ Connection pooling configured (limit: 5)

5. Verifying Prisma models...
   ✓ Model 'user' is accessible
   ✓ Model 'driver' is accessible
   ✓ Model 'dumpTruck' is accessible
   ✓ Model 'contract' is accessible
   ✓ Model 'schedule' is accessible
   ✓ Model 'activityLog' is accessible
   ✓ All models are accessible

6. Checking data...
   ✓ Users: 6
   ✓ Drivers: 3
   ✓ Dump Trucks: 5
   ✓ Contracts: 3

=================================
✓ Verification Complete!
=================================
```

## NPM Scripts

### Available Commands
```json
{
  "verify": "node scripts/verify-setup.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "node src/prisma/seed.js",
  "prisma:studio": "prisma studio",
  "setup": "npm run prisma:generate && npm run prisma:migrate && npm run prisma:seed && npm run verify"
}
```

### Quick Setup
```bash
npm run setup
```
Runs: generate → migrate → seed → verify (all in one command)

### Individual Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Verify setup
npm run verify

# Open Prisma Studio
npm run prisma:studio
```

## Database Schema

### Models Overview
- **User** (6 fields, 1 relation)
- **Driver** (8 fields, 3 relations)
- **DumpTruck** (7 fields, 1 relation)
- **Contract** (9 fields, 1 relation)
- **Schedule** (10 fields, 4 relations)
- **ActivityLog** (8 fields, 2 relations)

### Key Relationships
```
User 1:1 Driver (optional)
Contract 1:N Schedule
DumpTruck 1:N Schedule
Driver 1:N Schedule
Schedule 1:N ActivityLog
Driver 1:N ActivityLog
```

### Cascade Behaviors
- **Contract deletion**: Cascades to Schedules
- **Schedule deletion**: Cascades to ActivityLogs
- **Driver/Truck deletion**: Restricted if active schedules exist
- **User deletion**: Sets Driver.userId to null

## Import Verification

### All Services Import Correctly
✓ All service files import from `../config/database`
✓ Consistent import pattern across:
  - auth.service.js
  - user.service.js
  - driver.service.js
  - dumpTruck.service.js
  - contract.service.js
  - schedule.service.js
  - activity.service.js
  - report.service.js
  - seed.js

## Best Practices Implemented

1. **Single Instance**: Singleton pattern prevents multiple PrismaClient instances
2. **Connection Pooling**: Optimizes database connections
3. **Graceful Shutdown**: Properly closes connections on exit
4. **Environment Awareness**: Different configs for dev/prod
5. **Centralized Config**: All imports from single source
6. **Error Handling**: Proper error handling in all service methods
7. **Transaction Support**: Ready for Prisma transactions when needed
8. **Logging**: Environment-based query logging

## Troubleshooting

### Connection Issues
```bash
# Error: P1001 - Can't connect to database
→ Check DATABASE_URL in .env
→ Verify MySQL is running
→ Confirm credentials are correct
```

### Database Doesn't Exist
```sql
CREATE DATABASE dump_truck_db;
```

### Models Not Generated
```bash
npm run prisma:generate
```

### Tables Don't Exist
```bash
npm run prisma:migrate
```

### No Data
```bash
npm run prisma:seed
```

## Performance Considerations

### Connection Pooling Benefits
- Reduces connection overhead
- Prevents connection exhaustion
- Improves query performance
- Handles concurrent requests efficiently

### Recommended Settings
- **Development**: 5 connections sufficient
- **Production**: May need to increase based on load
- **High Traffic**: Consider 10-20 connections

### Monitoring
```javascript
// Check active connections
const connections = await prisma.$queryRaw`
  SELECT COUNT(*) as count
  FROM information_schema.processlist
`;
```

## Security

### Environment Variables
- Never commit `.env` file
- Use different secrets in production
- Rotate JWT secrets regularly
- Use strong database passwords

### Database User Permissions
```sql
-- Create dedicated user with limited permissions
CREATE USER 'dump_truck_api'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON dump_truck_db.* TO 'dump_truck_api'@'localhost';
FLUSH PRIVILEGES;
```

## Migration Strategy

### Development
```bash
npm run prisma:migrate
```

### Production
```bash
# Generate migration
npx prisma migrate dev --create-only

# Review migration SQL
# Apply to production
npx prisma migrate deploy
```

## Conclusion

The Prisma setup is optimized for:
- **Performance**: Connection pooling and singleton pattern
- **Reliability**: Graceful shutdown and error handling
- **Maintainability**: Centralized configuration
- **Developer Experience**: Verification scripts and logging
- **Production Ready**: Environment-based configuration

All implementations follow Prisma best practices and are production-ready.
