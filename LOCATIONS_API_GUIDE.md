# API Registration with Locations

## 📋 Overview

The registration API now supports creating companies with location relationships (countries and cities). The system automatically handles company creation during user registration.

## 🌍 Available Endpoints

### Locations
- `GET /locations/countries` - Get all available countries
- `GET /locations/countries/:countryId/cities` - Get cities by country

### Authentication
- `POST /auth/register` - Register user with company creation

## 📝 Registration Format

### New Registration Structure

```json
{
  "email": "admin@netsolutionlabs.com",
  "password": "Password123!",
  "first_name": "Wilmer",
  "last_name": "Hernandez", 
  "role": "ADMIN",
  "company": {
    "name": "NetSolutionLabs",
    "nit": "900123456-7",
    "email": "contact@netsolutionlabs.com",
    "phone": "+57 3001234567",
    "address": "Cra 10 # 45-23",
    "countryId": "clxxx-country-co-xxxx",
    "cityId": "clxxx-city-baq-xxxx"
  },
  "company_id": "fc7b0a32-d48c-4e0d-98b1-1e4d6b8efb79"  // Optional: if company exists
}
```

### Field Changes
- `firstName` → `first_name`
- `lastName` → `last_name`
- `companyId` → removed (now auto-generated or use `company_id`)
- Added nested `company` object with location IDs

## 🗃️ Database Structure

### Countries Table
```sql
countries (
  id          String @id @default(cuid())
  key         String @unique  -- Country code (e.g., "CO", "VE")
  value       String          -- Country name (e.g., "Colombia")
  created_at  DateTime
  updated_at  DateTime
)
```

### Cities Table
```sql
cities (
  id          String @id @default(cuid())
  key         String @unique  -- City code (e.g., "BOG", "MED")
  value       String          -- City name (e.g., "Bogotá")
  country_id  String          -- Reference to country
  created_at  DateTime
  updated_at  DateTime
)
```

### Updated Companies Table
```sql
companies (
  id          String @id @default(cuid())
  name        String
  nit         String @unique
  email       String
  phone       String
  address     String
  country_id  String  -- Reference to country
  city_id     String  -- Reference to city
  created_at  DateTime
  updated_at  DateTime
)
```

## 🚀 How It Works

1. **Get Available Locations**: First, retrieve countries and cities from the locations endpoints
2. **Register User**: Send registration data with company information and location IDs
3. **Auto Company Creation**: If no `company_id` is provided, the system creates a new company
4. **User-Company Link**: User is automatically linked to the company

## 📋 Sample Workflow

### 1. Get Countries
```bash
GET /locations/countries

Response:
{
  "message": "Countries retrieved successfully",
  "countries": [
    {
      "id": "clxxx-country-co-xxxx",
      "key": "CO",
      "value": "Colombia",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Cities by Country
```bash
GET /locations/countries/clxxx-country-co-xxxx/cities

Response:
{
  "message": "Cities retrieved successfully", 
  "cities": [
    {
      "id": "clxxx-city-baq-xxxx",
      "key": "BAQ",
      "value": "Barranquilla",
      "countryId": "clxxx-country-co-xxxx",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Register User with Company
```bash
POST /auth/register
{
  "email": "admin@netsolutionlabs.com",
  "password": "Password123!",
  "first_name": "Wilmer",
  "last_name": "Hernandez",
  "role": "ADMIN",
  "company": {
    "name": "NetSolutionLabs", 
    "nit": "900123456-7",
    "email": "contact@netsolutionlabs.com",
    "phone": "+57 3001234567",
    "address": "Cra 10 # 45-23",
    "countryId": "clxxx-country-co-xxxx",
    "cityId": "clxxx-city-baq-xxxx"
  }
}
```

## 🏗️ Architecture

### Modules
- **LocationsModule**: Handles countries and cities
- **AuthModule**: Enhanced with company creation during registration
- **CompanyEntity**: Updated with location relationships

### Key Changes
- Company entity now has `countryId` and `cityId` instead of string fields
- Registration process creates company if needed
- Profile endpoint returns company with location details
- Full location relationships maintained in database

## 🎯 Benefits

1. **Normalized Data**: Countries and cities are properly normalized
2. **Relationship Integrity**: Foreign key relationships ensure data consistency  
3. **Scalability**: Easy to add new countries/cities
4. **Rich Queries**: Can easily query companies by location
5. **Data Consistency**: Prevents typos in location names

This structure provides a robust foundation for location-based features while maintaining clean separation of concerns.
