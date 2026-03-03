# Postman Testing - EXACT STEPS

## ✅ Server Status: WORKING
- Health check: `http://localhost:5001/health` returns 200 OK
- Server running on port 5001

## 🔧 Postman Configuration

### Step 1: Create Request
1. Open Postman
2. Click **+ New** (or **Request**)
3. Set **Method**: `POST`
4. Set **URL**: `http://localhost:5001/api/auth/register`

### Step 2: Headers
1. Go to **Headers** tab
2. Add header:
   - **Key**: `Content-Type`
   - **Value**: `application/json`

### Step 3: Body
1. Go to **Body** tab
2. Select **raw**
3. Choose **JSON** from dropdown
4. Add this content:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

### Step 4: Send
1. Click **Send** button
2. Check response below

## 🎯 Expected Response
**Status**: 201 Created
**Response Body**:
```json
{
  "_id": "generated_user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

## 🚨 If You Get 500 Error:

1. **Check URL**: Must be `http://localhost:5001/api/auth/register`
2. **Check Headers**: Must have `Content-Type: application/json`
3. **Check Body**: Must be valid JSON
4. **Check Server**: Make sure server is running (see health check above)

## 📱 Alternative Test
If Postman still doesn't work, try this in browser:
1. Open browser dev tools (F12)
2. Go to Console tab
3. Run:
```javascript
fetch('http://localhost:5001/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: '123456'
  })
}).then(r => r.json()).then(console.log)
```
