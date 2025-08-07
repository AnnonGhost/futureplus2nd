# Future Plus - Vercel Deployment Guide

## Required Environment Variables for Vercel

### 1. Database Configuration
```bash
# For Vercel Postgres (Recommended)
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# OR for Vercel with SQLite (Development only)
DATABASE_URL="file:./dev.db"
```

**Note:** For production, it's recommended to use Vercel Postgres or another PostgreSQL provider.

### 2. Application Configuration
```bash
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
```

### 3. Admin Configuration (Required)
```bash
ADMIN_EMAIL="admin@futureplus.in"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_KEY="your-unique-admin-key-2024"
```

### 4. Security & Authentication
```bash
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="https://your-app.vercel.app"
```

### 5. Optional: Z-AI Web Dev SDK (if using AI features)
```bash
Z_AI_API_KEY="your-z-ai-api-key"
```

## How to Set Up Environment Variables on Vercel

### Method 1: Using Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables" from the left menu
4. Add each variable with its value
5. Click "Save" and then "Redeploy"

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD production
vercel env add ADMIN_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Deploy
vercel --prod
```

## Database Setup for Production

### Option 1: Vercel Postgres (Recommended)
1. In your Vercel project dashboard, go to "Storage" tab
2. Click "Create Database" and choose "Postgres"
3. Once created, Vercel will automatically provide the `DATABASE_URL`
4. Add it to your environment variables

### Option 2: External PostgreSQL Provider
```bash
# Example for Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Example for Railway
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@containers.railway.app:5432/railway"
```

### Option 3: SQLite (Not Recommended for Production)
If you must use SQLite in production, you'll need to set up a persistent storage solution.

## Generating Required Secrets

### NextAuth Secret
Generate a secure random string for NextAuth:
```bash
# Using OpenSSL
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Admin Password
Generate a secure admin password:
```bash
# Using OpenSSL
openssl rand -base64 12

# OR use a password manager to generate a strong password
```

### Admin Key
Generate a unique admin key:
```bash
# Example format
echo "FUTUREPLUS_ADMIN_KEY_$(date +%Y)"
```

## Pre-Deployment Checklist

1. ✅ Set up database (Vercel Postgres recommended)
2. ✅ Add all required environment variables
3. ✅ Generate secure secrets
4. ✅ Update `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
5. ✅ Run database migrations (if using Prisma)
6. ✅ Test all features in production environment

## Post-Deployment Steps

### 1. Database Initialization
After deployment, you may need to initialize the database with seed data:

```bash
# Connect to your Vercel project
vercel env pull .env.production

# Run database migrations and seed
npx prisma db push
npx tsx prisma/seed.ts
```

### 2. Admin Account Setup
The seed script will create an admin account with the credentials you provided in the environment variables.

### 3. Testing
Test all critical features:
- User registration and login
- Wallet functionality (recharge/withdrawal)
- Plan activation
- Referral system
- Admin panel access

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from Vercel
   - Check SSL mode requirements

2. **Authentication Issues**
   - Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - Ensure admin credentials are correctly set

3. **Build Failures**
   - Check all environment variables are set
   - Verify database schema is up to date
   - Check for missing dependencies

### Debug Commands
```bash
# Check environment variables on Vercel
vercel env ls

# View deployment logs
vercel logs your-app.vercel.app

# Redeploy with latest changes
vercel --prod
```

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use different values for development and production
   - Regularly rotate secrets and passwords

2. **Database Security**
   - Use strong database credentials
   - Enable SSL/TLS for database connections
   - Regular database backups

3. **Application Security**
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Use HTTPS for all connections

## Support

If you encounter any issues during deployment:
1. Check Vercel deployment logs
2. Verify all environment variables are correctly set
3. Ensure database is properly configured
4. Review the project documentation

For additional support, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)