# API Testing Guide for Shopify Backend

## Server Status
- **Backend:** http://localhost:5001 ✅ RUNNING
- **Frontend:** http://localhost:3000 (needs restart)
- **Database:** MongoDB Connected ✅

## Postman Configuration

### 1. Create New Request
1. **Method:** POST
2. **URL:** `http://localhost:5001/api/auth/register`
3. **Headers Tab:**
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body Tab:**
   - Select `raw` and `JSON`
   - Add this JSON:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "123456"
   }
   ```

### 2. Test Registration
- Click **Send** button
- Expected Status: **201 Created**
- Expected Response:
   ```json
   {
     "_id": "user_id",
     "name": "Test User", 
     "email": "test@example.com",
     "role": "user",
     "token": "jwt_token_here"
   }
   ```

### 3. Test Login
- **Method:** POST
- **URL:** `http://localhost:5001/api/auth/login`
- **Headers:** Same as above
- **Body:**
   ```json
   {
     "email": "test@example.com",
     "password": "123456"
   }
   ```

## Troubleshooting Steps

### If Postman Shows "Could not get any response":

1. **Check Server is Running:**
   ```bash
   # Open new terminal and run:
   curl http://localhost:5001/
   # Should return: "API is running..."
   ```

2. **Verify Port:**
   - Make sure URL is: `http://localhost:5001` (not 5000)

3. **Check Firewall:**
   - Windows Firewall might block port 5001
   - Allow Node.js through firewall

4. **Restart Frontend:**
   ```bash
   # From project root:
   npm run dev
   ```

5. **Clear Postman Cache:**
   - In Postman: View → Clear Recent → Clear All

6. **Try Different Tool:**
   - Test with: `curl` or Insomnia
   - Example: `curl -X POST http://localhost:5001/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"123456\"}"`

## All Available Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role
