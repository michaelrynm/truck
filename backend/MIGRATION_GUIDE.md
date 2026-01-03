# Migration Guide - Contract Fields Update

## Changes Made

Added two new required fields to the `Contract` model:

1. **numberOfTrucks** (Int) - Number of trucks being rented in the contract
2. **price** (Decimal) - Contract price with 2 decimal precision

## Files Updated

### 1. Prisma Schema
**File**: `prisma/schema.prisma`

Added fields:
```prisma
numberOfTrucks Int
price          Decimal @db.Decimal(10, 2)
```

### 2. Validation Schemas
**File**: `src/validations/contract.validation.js`

Updated both create and update schemas:
```javascript
numberOfTrucks: z.number().int().positive('Number of trucks must be a positive integer'),
price: z.number().positive('Price must be a positive number'),
```

### 3. Seed Data
**File**: `src/prisma/seed.js`

Updated all contract samples with new fields.

### 4. Postman Collection
**File**: `Dump_Truck_API.postman_collection.json`

Updated Create Contract example request.

## Migration Steps

### Step 1: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 2: Create Migration
```bash
npm run prisma:migrate
```

When prompted, enter migration name: `add_contract_fields`

This will:
- Create migration SQL file
- Apply changes to database
- Update Prisma Client

### Step 3: (Optional) Reset & Reseed Database
If you want fresh data with new fields:

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually reseed
npm run prisma:seed
```

## API Changes

### Create Contract Request
**Before:**
```json
{
  "clientName": "ABC Company",
  "location": "New York",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "description": "Project description"
}
```

**After:**
```json
{
  "clientName": "ABC Company",
  "location": "New York",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "numberOfTrucks": 3,
  "price": 150000.00,
  "description": "Project description"
}
```

### Update Contract Request
Both fields are now optional in updates:
```json
{
  "numberOfTrucks": 5,
  "price": 200000.00
}
```

## Database Schema Changes

### SQL Migration Preview
```sql
ALTER TABLE `contracts`
ADD COLUMN `numberOfTrucks` INTEGER NOT NULL,
ADD COLUMN `price` DECIMAL(10,2) NOT NULL;
```

## Validation Rules

### numberOfTrucks
- **Type**: Integer
- **Required**: Yes (for create)
- **Validation**: Must be a positive integer (> 0)

### price
- **Type**: Decimal(10, 2)
- **Required**: Yes (for create)
- **Validation**: Must be a positive number (> 0)
- **Precision**: Up to 10 digits, 2 decimal places
- **Example**: 150000.00, 99999999.99

## Testing

### 1. Test Create Contract
```bash
curl -X POST http://localhost:8000/api/contracts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "location": "Jakarta",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "numberOfTrucks": 2,
    "price": 100000.00,
    "description": "Test contract"
  }'
```

### 2. Test Validation
Try invalid values to test validation:

**Invalid numberOfTrucks (negative):**
```json
{
  "numberOfTrucks": -1
}
```
Expected: 400 Bad Request - "Number of trucks must be a positive integer"

**Invalid price (negative):**
```json
{
  "price": -5000
}
```
Expected: 400 Bad Request - "Price must be a positive number"

**Missing required fields:**
```json
{
  "clientName": "Test"
}
```
Expected: 400 Bad Request - Validation errors for missing fields

## Rollback (If Needed)

If you need to rollback this migration:

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back add_contract_fields

# Then manually remove fields from schema
# And run new migration
npm run prisma:migrate
```

## Notes

- All existing contracts in database will need these fields populated during migration
- The seed script has been updated with sample values
- API clients must update their requests to include new required fields
- Both fields are required for CREATE but optional for UPDATE operations
