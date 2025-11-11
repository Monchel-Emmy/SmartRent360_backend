# Environment Variables Setup Guide

## What is a `.env` file?

A `.env` (environment) file stores sensitive configuration data like database passwords and API keys. It's kept out of version control (via `.gitignore`) to protect your secrets.

## Step-by-Step Setup

### Step 1: Create the `.env` file

1. In your project root directory (`smartRent360_backend`), create a new file named `.env`
2. **Important**: The file must be named exactly `.env` (with the dot at the beginning, no extension)

### Step 2: Add the Required Variables

Copy and paste this template into your `.env` file:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/smartrent360?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_VERSION=v1
```

### Step 3: Replace with Your Actual Values

#### A. Database URL (`DATABASE_URL`)

**Format:**
```
postgresql://username:password@host:port/database_name?schema=public
```

**Example for local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/smartrent360?schema=public"
```

**Breaking it down:**
- `postgresql://` - Database type
- `postgres` - Your PostgreSQL username (default is "postgres")`
- `mypassword` - Your PostgreSQL password
- `localhost` - Database host (use `localhost` for local development)
- `5432` - PostgreSQL port (default is 5432)
- `smartrent360` - Database name (create this database first)
- `?schema=public` - Schema name (keep this as is)

**How to get your database credentials:**

1. **If you have PostgreSQL installed locally:**
   - Username: Usually `postgres` (or your system username)
   - Password: The password you set when installing PostgreSQL
   - Host: `localhost`
   - Port: `5432` (default)

2. **If you don't have PostgreSQL installed:**
   - **Option 1: Install locally**
     - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
     - Mac: `brew install postgresql` or download from postgresql.org
     - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)
   
   - **Option 2: Use a cloud database (free tier available)**
     - [Supabase](https://supabase.com) - Free PostgreSQL hosting
     - [ElephantSQL](https://www.elephantsql.com) - Free PostgreSQL hosting
     - [Railway](https://railway.app) - Free PostgreSQL hosting
   
   - **Option 3: Use Docker (recommended for development)**
     ```bash
     docker run --name smartrent360-db -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=smartrent360 -p 5432:5432 -d postgres
     ```
     Then use: `DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/smartrent360?schema=public"`

3. **Create the database:**
   ```sql
   -- Connect to PostgreSQL (using psql or pgAdmin)
   CREATE DATABASE smartrent360;
   ```

#### B. JWT Secret (`JWT_SECRET`)

This is a secret key used to sign and verify JWT tokens. **Make it long and random!**

**Generate a secure secret:**
- Use an online generator: [randomkeygen.com](https://randomkeygen.com)
- Or use Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Example:**
```env
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

**⚠️ Important:** 
- Never share this secret
- Use different secrets for development and production
- Make it at least 32 characters long

#### C. JWT Expires In (`JWT_EXPIRES_IN`)

How long the authentication token is valid.

**Common values:**
- `"7d"` - 7 days (good for development)
- `"24h"` - 24 hours
- `"1h"` - 1 hour (more secure)

#### D. Port (`PORT`)

The port number your server will run on.

**Default:** `3000`

**If port 3000 is busy, use another:**
```env
PORT=3001
```

#### E. Node Environment (`NODE_ENV`)

- `development` - For local development
- `production` - For production deployment
- `test` - For running tests

#### F. API Version (`API_VERSION`)

The API version prefix. Keep as `v1` for now.

### Step 4: Complete Example

Here's a complete example `.env` file for local development:

```env
# Database Connection (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:mySecurePassword123@localhost:5432/smartrent360?schema=public"

# JWT Authentication
JWT_SECRET="mySuperSecretJWTKey123456789012345678901234567890"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_VERSION=v1
```

### Step 5: Verify Your Setup

1. Make sure your `.env` file is in the project root (same folder as `package.json`)
2. Check that your database is running and accessible
3. Test the connection:
   ```bash
   # If using PostgreSQL locally
   psql -U postgres -d smartrent360
   ```

## Common Issues & Solutions

### Issue 1: "DATABASE_URL is required" error
**Solution:** Make sure your `.env` file exists and has `DATABASE_URL` set

### Issue 2: "Connection refused" error
**Solution:** 
- Check if PostgreSQL is running: `pg_isready` (Linux/Mac) or check Services (Windows)
- Verify the host and port are correct
- Check your firewall settings

### Issue 3: "Authentication failed" error
**Solution:**
- Double-check your username and password
- Make sure the user has permission to access the database

### Issue 4: "Database does not exist" error
**Solution:**
- Create the database first:
  ```sql
  CREATE DATABASE smartrent360;
  ```

## Security Best Practices

1. ✅ **Never commit `.env` to Git** (it's already in `.gitignore`)
2. ✅ **Use strong, random JWT secrets**
3. ✅ **Use different secrets for dev/production**
4. ✅ **Don't share your `.env` file**
5. ✅ **Use environment variables in production** (not a file)

## Next Steps

After setting up your `.env` file:

1. Install dependencies: `npm install`
2. Generate Prisma Client: `npm run prisma:generate`
3. Run database migrations: `npm run prisma:migrate`
4. Start the server: `npm run dev`

## Need Help?

- **PostgreSQL Installation:** [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Prisma Setup:** [prisma.io/docs](https://www.prisma.io/docs)
- **Environment Variables:** [12factor.net/config](https://12factor.net/config)



