# Fix PostgreSQL Authentication Error

## The Problem
You're getting: `Authentication failed against database server at localhost, the provided database credentials for postgres are not valid.`

This means your `.env` file has incorrect PostgreSQL username/password.

## Step-by-Step Solution

### Step 1: Find Your PostgreSQL Credentials

**Option A: Check if you remember your PostgreSQL password**
- When you installed PostgreSQL, you were asked to set a password for the `postgres` user
- This is the password you need

**Option B: Check Windows Services (if PostgreSQL was installed as a service)**
1. Press `Win + R`, type `services.msc`, press Enter
2. Look for "postgresql" service
3. Check the service properties to see how it's configured

**Option C: Try the default/empty password**
- Some PostgreSQL installations use an empty password or `postgres` as the password
- Try these in your `.env` file:
  - Password: (empty/nothing)
  - Password: `postgres`
  - Password: `admin`
  - Password: `root`

### Step 2: Test Your PostgreSQL Connection

**Method 1: Using psql (Command Line)**
```powershell
# Try connecting with different passwords
psql -U postgres -d postgres
# It will prompt for password - try common ones or what you remember
```

**Method 2: Using pgAdmin (GUI)**
1. Open pgAdmin (usually installed with PostgreSQL)
2. Try to connect to localhost
3. Use username: `postgres`
4. Try different passwords until one works

**Method 3: Check PostgreSQL Configuration**
```powershell
# Check if PostgreSQL is running
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

### Step 3: Reset PostgreSQL Password (If You Forgot It)

**Windows Method:**
1. Find your PostgreSQL data directory (usually `C:\Program Files\PostgreSQL\[version]\data\`)
2. Stop PostgreSQL service:
   ```powershell
   Stop-Service postgresql-x64-[version]
   ```
3. Create a file `pg_hba.conf.backup` (backup your current config)
4. Edit `pg_hba.conf` and change this line:
   ```
   # Change from:
   host all all 127.0.0.1/32 md5
   # To:
   host all all 127.0.0.1/32 trust
   ```
5. Start PostgreSQL:
   ```powershell
   Start-Service postgresql-x64-[version]
   ```
6. Connect without password:
   ```powershell
   psql -U postgres
   ```
7. Change password:
   ```sql
   ALTER USER postgres PASSWORD 'your_new_password';
   ```
8. Revert `pg_hba.conf` back to `md5`
9. Restart PostgreSQL

**Easier Method: Use pgAdmin**
1. Open pgAdmin
2. If you can connect, right-click on "Login/Group Roles" → "postgres" → "Properties"
3. Go to "Definition" tab
4. Set new password
5. Save

### Step 4: Update Your .env File

Once you know your correct password, update your `.env` file:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/smartrent360?schema=public"
```

**Replace `YOUR_ACTUAL_PASSWORD` with your actual PostgreSQL password.**

### Step 5: Create the Database

After fixing authentication, create the database:

**Using psql:**
```powershell
psql -U postgres
# Enter your password when prompted
```
Then in psql:
```sql
CREATE DATABASE smartrent360;
\q
```

**Using pgAdmin:**
1. Connect to PostgreSQL server
2. Right-click "Databases" → "Create" → "Database"
3. Name: `smartrent360`
4. Click "Save"

### Step 6: Test the Connection Again

```powershell
npm run prisma:migrate
```

## Quick Fix: Common Passwords to Try

Try these common passwords in your `.env` file:

1. **Empty password:**
   ```env
   DATABASE_URL="postgresql://postgres:@localhost:5432/smartrent360?schema=public"
   ```

2. **Password: postgres**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smartrent360?schema=public"
   ```

3. **Password: admin**
   ```env
   DATABASE_URL="postgresql://postgres:admin@localhost:5432/smartrent360?schema=public"
   ```

4. **Password: root**
   ```env
   DATABASE_URL="postgresql://postgres:root@localhost:5432/smartrent360?schema=public"
   ```

## Alternative: Use a Different User

If you have another PostgreSQL user, use that instead:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/smartrent360?schema=public"
```

## Still Having Issues?

1. **Check if PostgreSQL is running:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*postgres*"}
   ```

2. **Check PostgreSQL port (default is 5432):**
   ```powershell
   netstat -an | findstr 5432
   ```

3. **Try connecting with pgAdmin first** - it's easier to test credentials there

4. **Check PostgreSQL logs** for more details:
   - Usually in: `C:\Program Files\PostgreSQL\[version]\data\log\`

## Need More Help?

If you're still stuck, try:
1. Reinstall PostgreSQL and remember the password you set
2. Use Docker instead (easier):
   ```powershell
   docker run --name smartrent360-db -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=smartrent360 -p 5432:5432 -d postgres
   ```
   Then use: `DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/smartrent360?schema=public"`

3. Use a cloud database (Supabase, ElephantSQL) - they give you the connection string


