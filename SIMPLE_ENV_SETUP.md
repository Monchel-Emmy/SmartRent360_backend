# Simple .env File Setup Guide

## What You Need to Do

### 1. Create a `.env` file in your project root

Create a new file named `.env` (with the dot at the beginning) in the same folder as your `package.json`.

### 2. Copy this template into your `.env` file:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/smartrent360?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
API_VERSION=v1
```

### 3. Replace the values with your actual information:

#### 🔹 DATABASE_URL

**What it looks like:**
```
postgresql://username:password@localhost:5432/database_name?schema=public
```

**What to replace:**
- `postgres` → Your PostgreSQL username (usually "postgres")
- `yourpassword` → Your PostgreSQL password
- `smartrent360` → Your database name (create this first)

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/smartrent360?schema=public"
```

**Don't have PostgreSQL?**
- **Option 1:** Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
- **Option 2:** Use Docker: `docker run --name smartrent360-db -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=smartrent360 -p 5432:5432 -d postgres`
- **Option 3:** Use a free cloud database like [Supabase](https://supabase.com)

**Create the database:**
```sql
-- Open PostgreSQL (psql or pgAdmin) and run:
CREATE DATABASE smartrent360;
```

#### 🔹 JWT_SECRET

This is a secret key for authentication. Make it long and random!

**Generate one:**
- Run in terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Or use: [randomkeygen.com](https://randomkeygen.com)

**Example:**
```env
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

#### 🔹 Other values (usually keep as-is):

- `JWT_EXPIRES_IN="7d"` - Token expires in 7 days
- `PORT=3000` - Server runs on port 3000
- `NODE_ENV=development` - Development mode
- `API_VERSION=v1` - API version

### 4. Your final `.env` file should look like this:

```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/smartrent360?schema=public"
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
API_VERSION=v1
```

## Quick Checklist

- [ ] Created `.env` file in project root
- [ ] Added all required variables
- [ ] Replaced `DATABASE_URL` with your PostgreSQL connection string
- [ ] Generated and set a secure `JWT_SECRET`
- [ ] Created the database `smartrent360` in PostgreSQL
- [ ] Verified PostgreSQL is running

## Common Problems

**Problem:** "DATABASE_URL is required" error
- **Fix:** Make sure `.env` file exists and has `DATABASE_URL` set

**Problem:** "Connection refused" error  
- **Fix:** Check if PostgreSQL is running on your computer

**Problem:** "Authentication failed" error
- **Fix:** Double-check your username and password in `DATABASE_URL`

**Problem:** "Database does not exist" error
- **Fix:** Create the database first: `CREATE DATABASE smartrent360;`

## What's Next?

After setting up `.env`:
1. Run: `npm install`
2. Run: `npm run prisma:generate`
3. Run: `npm run prisma:migrate`
4. Run: `npm run dev`

Your server should start successfully! 🎉


