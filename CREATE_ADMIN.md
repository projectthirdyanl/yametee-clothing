# Creating Admin User

You need to create an admin user before you can login. Here are several ways to do it:

## Method 1: Using Node Script (Recommended)

```bash
node scripts/create-admin.js <email> <password> <name>
```

Example:
```bash
node scripts/create-admin.js admin@yametee.com admin123 "Admin User"
```

If no arguments provided, defaults to:
- Email: admin@yametee.com
- Password: admin123
- Name: Admin

## Method 2: Using API Endpoint

Make a POST request to `/api/admin/init`:

```bash
curl -X POST http://localhost:3000/api/admin/init \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yametee.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

Or use a tool like Postman or Thunder Client in VS Code.

## Method 3: Auto-Create on First Login

The login API will automatically create an admin user if:
- No admin users exist in the database
- You use an email that contains "admin" or is "admin@yametee.com"

Just try logging in with:
- Email: admin@yametee.com
- Password: (any password you want)

## Method 4: Using Prisma Studio

1. Run `npm run db:studio`
2. Open the Customer table
3. Create a new customer with:
   - Email: your email
   - Hashed Password: (use bcrypt to hash your password)
   - Name: Admin

## Verify Database Connection

Make sure your `.env` file has the correct database URL:

```env
DATABASE_URL="postgresql://itadmin:!admin00@192.168.120.6:5432/yame_tee?schema=public"
```

Then run:
```bash
npx prisma db push
```

This will create all the tables if they don't exist.
