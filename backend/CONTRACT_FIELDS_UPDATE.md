# Contract Fields Update - Summary

## ✅ Changes Implemented

### 1. Database Schema (Prisma)
**File**: [prisma/schema.prisma](prisma/schema.prisma:92-93)

Ditambahkan 2 field baru ke model Contract:
```prisma
numberOfTrucks Int              // Jumlah truck yang disewa
price          Decimal @db.Decimal(10, 2)  // Harga kontrak
```

### 2. Validation (Zod)
**File**: [src/validations/contract.validation.js](src/validations/contract.validation.js:8-9)

**Create Schema** - Required fields:
```javascript
numberOfTrucks: z.number().int().positive('Number of trucks must be a positive integer'),
price: z.number().positive('Price must be a positive number'),
```

**Update Schema** - Optional fields:
```javascript
numberOfTrucks: z.number().int().positive('Number of trucks must be a positive integer').optional(),
price: z.number().positive('Price must be a positive number').optional(),
```

### 3. Seed Data
**File**: [src/prisma/seed.js](src/prisma/seed.js:189-216)

Semua sample contracts sudah diupdate dengan data baru:
- Contract 1: 3 trucks, Rp 150,000
- Contract 2: 2 trucks, Rp 200,000
- Contract 3: 5 trucks, Rp 180,000

### 4. API Documentation
**File**: [Dump_Truck_API.postman_collection.json](Dump_Truck_API.postman_collection.json:353)

Postman collection updated dengan contoh request baru.

## 📋 Struktur Contract (Updated)

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Auto | - | Primary key |
| clientName | String | Yes | Min 1 char | Nama klien |
| location | String | Yes | Min 1 char | Lokasi proyek |
| startDate | DateTime | Yes | Valid date | Tanggal mulai |
| endDate | DateTime | Yes | After startDate | Tanggal selesai |
| **numberOfTrucks** | **Integer** | **Yes** | **> 0** | **Jumlah truck** |
| **price** | **Decimal(10,2)** | **Yes** | **> 0** | **Harga kontrak** |
| status | Enum | No | ACTIVE/COMPLETED/CANCELLED | Status kontrak |
| description | Text | No | - | Deskripsi |
| createdAt | DateTime | Auto | - | Waktu dibuat |
| updatedAt | DateTime | Auto | - | Waktu update |

## 🔄 API Endpoints yang Terpengaruh

### 1. POST /api/contracts (Create)
**Request Body (UPDATED):**
```json
{
  "clientName": "ABC Construction",
  "location": "Jakarta",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "numberOfTrucks": 3,        // ✨ NEW - Required
  "price": 150000.00,         // ✨ NEW - Required
  "status": "ACTIVE",         // Optional
  "description": "Project ABC" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contract created successfully",
  "data": {
    "id": "uuid-here",
    "clientName": "ABC Construction",
    "location": "Jakarta",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "numberOfTrucks": 3,
    "price": "150000.00",
    "status": "ACTIVE",
    "description": "Project ABC",
    "createdAt": "2024-03-20T10:00:00.000Z",
    "updatedAt": "2024-03-20T10:00:00.000Z"
  }
}
```

### 2. PUT /api/contracts/:id (Update)
**Request Body (UPDATED):**
```json
{
  "numberOfTrucks": 5,    // ✨ Now can be updated
  "price": 200000.00      // ✨ Now can be updated
}
```

### 3. GET /api/contracts (List)
Response sekarang includes field baru:
```json
{
  "success": true,
  "message": "Contracts retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "clientName": "ABC Construction",
      "numberOfTrucks": 3,     // ✨ NEW
      "price": "150000.00",    // ✨ NEW
      ...
    }
  ]
}
```

### 4. GET /api/contracts/:id (Get by ID)
Response includes field baru.

## 🚀 Langkah-langkah Migration

### 1. Generate Prisma Client
```bash
npm run prisma:generate
```

### 2. Create & Apply Migration
```bash
npm run prisma:migrate
```
Nama migration: `add_contract_fields`

### 3. (Optional) Reseed Database
```bash
npm run prisma:seed
```

## ⚠️ Breaking Changes

### Untuk Frontend/Client Apps:

1. **Create Contract** - Wajib kirim field baru:
   - `numberOfTrucks` (integer, > 0)
   - `price` (number, > 0)

2. **Update Contract** - Field baru tersedia untuk update (optional)

3. **Response Objects** - Semua response contract sekarang include:
   - `numberOfTrucks`
   - `price`

## 🧪 Testing

### Valid Request:
```bash
curl -X POST http://localhost:8000/api/contracts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "location": "Jakarta",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "numberOfTrucks": 2,
    "price": 100000.00
  }'
```

### Validation Errors:

**Missing numberOfTrucks:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "numberOfTrucks",
      "message": "Required"
    }
  ]
}
```

**Invalid numberOfTrucks (negative):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "numberOfTrucks",
      "message": "Number of trucks must be a positive integer"
    }
  ]
}
```

**Invalid price (negative):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

## 📊 Example Data

### Contract 1 - ABC Construction
```json
{
  "clientName": "ABC Construction",
  "location": "New York City",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "numberOfTrucks": 3,
  "price": 150000.00,
  "status": "ACTIVE",
  "description": "Construction site material hauling"
}
```

### Contract 2 - XYZ Developers
```json
{
  "clientName": "XYZ Developers",
  "location": "Los Angeles",
  "startDate": "2024-02-01",
  "endDate": "2024-08-31",
  "numberOfTrucks": 2,
  "price": 200000.00,
  "status": "ACTIVE",
  "description": "Demolition debris removal"
}
```

## 📝 Notes

- Service layer tidak perlu diubah (otomatis handle field baru)
- Controller tidak perlu diubah (otomatis handle field baru)
- Validation otomatis melalui Zod schemas
- Database constraints ensure data integrity
- Price menggunakan Decimal(10,2) untuk akurasi finansial
- numberOfTrucks menggunakan Integer untuk counting

## ✅ Files Modified

1. ✅ `prisma/schema.prisma` - Added fields to Contract model
2. ✅ `src/validations/contract.validation.js` - Added validation rules
3. ✅ `src/prisma/seed.js` - Updated sample data
4. ✅ `Dump_Truck_API.postman_collection.json` - Updated API examples
5. ✅ `MIGRATION_GUIDE.md` - Created migration guide
6. ✅ `CONTRACT_FIELDS_UPDATE.md` - This summary document

## 🔗 Related Documentation

- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Detailed migration steps
- [Prisma Schema](prisma/schema.prisma) - Database schema
- [Contract Validation](src/validations/contract.validation.js) - Validation rules
- [Seed Data](src/prisma/seed.js) - Sample data
