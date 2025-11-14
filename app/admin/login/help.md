# Admin Login Instructions

## Default Admin Credentials

**Email:** `admin@yametee.com`  
**Password:** `admin123`

⚠️ **Important:** Change the password after your first login!

## If You Can't Login

1. **Make sure the database is connected:**
   ```bash
   npx prisma db push
   ```

2. **Create a new admin user:**
   ```bash
   node scripts/create-admin.js your-email@example.com your-password "Your Name"
   ```

3. **Or use the API endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/init \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com","password":"your-password","name":"Your Name"}'
   ```

4. **Check server logs** for any error messages

## Database Connection

Your database is configured at:
- **Host:** 192.168.120.6
- **Database:** yame_tee
- **Username:** itadmin

Make sure PostgreSQL is running and accessible from your application server.
