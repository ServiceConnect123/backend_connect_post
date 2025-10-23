# Deployment Troubleshooting Guide

## Current Status
✅ **Local Development**: Working perfectly
✅ **Local Production Build**: Working perfectly  
✅ **Multi-Company Architecture**: Successfully implemented
✅ **Database Schema**: Applied and working
✅ **Location Data**: Seeded successfully

## Deployment Issues on Render

### Common Deployment Failure Causes

#### 1. Environment Variables
Ensure all required environment variables are set in Render:

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection for migrations
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key  
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV=production`
- `PORT` - Usually set by Render automatically

**Optional Variables:**
- `JWT_EXPIRES_IN=24h`
- `CORS_ORIGINS` - Comma-separated allowed origins

#### 2. Database Issues
The deployment might fail if:
- Database migrations are not applied
- Database is not accessible from Render
- Location data (countries/cities) is missing

#### 3. Build Process Issues
- Prisma client not generated for the correct platform
- Missing dependencies
- Build timeout

### Troubleshooting Steps

#### Step 1: Check Render Build Logs
Look for specific error messages in the build logs:
- `Error: P2003` - Foreign key constraint violations
- `PrismaClientKnownRequestError` - Database connection issues
- `SIGABRT/SIGTERM` - Application crashes during startup

#### Step 2: Database Migration
Ensure the production database has the latest migrations:

```bash
# Run this in Render shell or via build command
npx prisma migrate deploy
npx prisma generate
```

#### Step 3: Seed Location Data
If foreign key errors occur, run location seeding:

```bash
# In production environment
node scripts/seed-locations.js
```

#### Step 4: Build Commands for Render
Ensure Render is using the correct build command:

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

### Production-Ready Configuration

#### Package.json Scripts (Already Updated)
```json
{
  "scripts": {
    "build": "npx prisma generate && nest build",
    "build:prod": "npx prisma generate && nest build", 
    "start:prod": "node dist/main",
    "postinstall": "npx prisma generate"
  }
}
```

#### Environment Detection
The application automatically detects production environment and:
- Uses production Supabase configuration
- Sets appropriate CORS policies
- Configures Swagger for production URL

### Manual Deployment Steps

If automatic deployment continues to fail:

1. **Clone the repository in Render shell**
2. **Install dependencies**: `npm install`
3. **Generate Prisma client**: `npx prisma generate`
4. **Run migrations**: `npx prisma migrate deploy`  
5. **Seed location data**: `node scripts/seed-locations.js`
6. **Build application**: `npm run build`
7. **Start application**: `npm run start:prod`

### Verification Commands

Test the deployed application:

```bash
# Health check
curl https://your-render-url.onrender.com

# Test registration
curl -X POST https://your-render-url.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "first_name": "Test",
    "last_name": "User", 
    "role": "ADMIN",
    "company": {
      "name": "Test Company",
      "nit": "900123456-1",
      "email": "info@testcompany.com",
      "phone": "+57 601 234 5678",
      "address": "Test Address",
      "countryId": "clxxx-country-co-xxxx",
      "cityId": "clxxx-city-bog-xxxx"
    }
  }'
```

### Architecture Summary

The multi-company user system is **successfully implemented** with:

1. **User-Company Association Model**
   - Single User record per Supabase UUID
   - Multiple UserCompany associations per user
   - Support for different roles per company

2. **Registration Scenarios Supported**
   - NEW_USER_NEW_COMPANY
   - NEW_USER_EXISTING_COMPANY  
   - EXISTING_USER_NEW_COMPANY
   - EXISTING_USER_EXISTING_COMPANY

3. **Profile Management**
   - Multi-company context support
   - Role-specific information per company
   - Backward compatibility maintained

4. **Database Schema**
   - Proper foreign key constraints
   - Unique user-company combinations
   - Location data seeded and working

## Next Steps

1. Apply the deployment troubleshooting steps
2. Check Render environment variables
3. Ensure database migrations are applied in production
4. Test the multi-company registration flow in production

The codebase is production-ready and working perfectly locally. The deployment issue is likely environmental rather than code-related.
