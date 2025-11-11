# 🔧 Fix PostgreSQL Password - Step by Step

## The Problem
Your password `MONCHEL1236` is **incorrect**. PostgreSQL is running, but authentication is failing.

## ✅ Solution Options (Choose One)

### Option 1: Use pgAdmin to Reset Password (Recommended if you have pgAdmin)

1. **Open pgAdmin**
   - Search for "pgAdmin" in Windows Start menu
   - Or look in: `C:\Program Files\PostgreSQL\[version]\pgAdmin 4\`

2. **Connect to PostgreSQL**
   - If it asks for a password, try:
     - Empty password (just press Enter)
     - `postgres`
     - `admin`
     - `root`
     - Or the password you remember setting

3. **Reset the Password**
   - In pgAdmin, expand "Servers" → "PostgreSQL [version]"
   - Expand "Login/Group Roles"
   - Right-click on "postgres" → "Properties"
   - Go to "Definition" tab
   - Enter new password: `MONCHEL1236`
   - Click "Save"

4. **Test Connection**
   ```powershell
   node test-db-connection.js
   ```

5. **Run Migration**
   ```powershell
   npm run prisma:migrate
   ```

### Option 2: Use Docker (Easiest - No Password Issues)

**Prerequisites:** Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

**Steps:**

1. **Run the setup script:**
   ```powershell
   .\setup-postgres-docker.ps1
   ```

2. **Or manually:**
   ```powershell
   docker run --name smartrent360-db -e POSTGRES_PASSWORD=MONCHEL1236 -e POSTGRES_DB=smartrent360 -p 5432:5432 -d postgres
   ```

3. **Wait 10 seconds for PostgreSQL to start**

4. **Test connection:**
   ```powershell
   node test-db-connection.js
   ```

5. **Run migration:**
   ```powershell
   npm run prisma:migrate
   ```

**✅ Your `.env` file is already correct for Docker!**

### Option 3: Use Cloud Database (No Installation Needed)

1. **Go to [Supabase.com](https://supabase.com)**
2. **Sign up (free)**
3. **Create a new project**
4. **Go to Settings → Database**
5. **Copy the connection string** (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
6. **Update your `.env` file:**
   ```env
   DATABASE_URL="[paste the connection string from Supabase]"
   ```
7. **Run migration:**
   ```powershell
   npm run prisma:migrate
   ```

### Option 4: Reinstall PostgreSQL (Last Resort)

1. **Uninstall PostgreSQL** from Windows Settings
2. **Download PostgreSQL** from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
3. **Install it** and **remember the password you set** (use `MONCHEL1236`)
4. **Update your `.env`** if needed
5. **Run migration:**
   ```powershell
   npm run prisma:migrate
   ```

## 🎯 Quick Decision Guide

- **Have pgAdmin?** → Use Option 1 (Reset password)
- **Have Docker?** → Use Option 2 (Docker - easiest)
- **Want no setup?** → Use Option 3 (Cloud database)
- **Nothing works?** → Use Option 4 (Reinstall)

## 🚀 After Fixing

Once your connection works:

```powershell
# 1. Test connection
node test-db-connection.js

# 2. Run migrations
npm run prisma:migrate

# 3. Start server
npm run dev
```

## 💡 Recommended: Use Docker

Docker is the easiest option because:
- ✅ No password confusion
- ✅ Works immediately
- ✅ Easy to reset
- ✅ Your `.env` already works with it

Just run:
```powershell
.\setup-postgres-docker.ps1
```

Then wait 10 seconds and run:
```powershell
npm run prisma:migrate
```

---

## Need Help?

If you're stuck, tell me which option you want to try and I'll help you step by step!


