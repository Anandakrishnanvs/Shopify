# Postman Screenshots Guide — Assignment

Use this guide to capture Postman screenshots for your Notion page.  
**Base URL:** `http://localhost:5001/api`  
**Server must be running:** `npm run server` or `npm run dev` (backend on port 5001)

---

## 1. Signup (Register)
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```
- **Expected:** Status `201` — Response with `_id`, `name`, `email`, `role`, `token`

---

## 2. Login
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```
- **Expected:** Status `200` — Response with `_id`, `name`, `email`, `role`, `token`
- Copy the `token` for use in Auth-protected endpoints.

---

## 3. Profile (Get current user / Update profile)
**Option A — Get profile (GET /me):**  
- **Method:** `GET`  
- **URL:** `http://localhost:5001/api/auth/me`  
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <your_token>`

**Option B — Update profile (PUT):**  
- **Method:** `PUT`  
- **URL:** `http://localhost:5001/api/auth/profile`  
- **Headers:** Same as above  
- **Body (raw JSON):**
```json
{
  "name": "Updated Name",
  "phone": "1234567890"
}
```

---

## 4. Logout
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/auth/logout`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`

---

## 5. Check User (Auth check)
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/auth/check-user`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`

---

## 6. Check Admin
- **Method:** `GET`
- **URL:** `http://localhost:5001/api/auth/check-admin`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`

Use the admin token from `admin@gmail.com` / `admin123` (after running `npm run seed`).

---

## Quick Token Setup in Postman
1. Run **Login** and copy the `token` from the response.
2. For protected endpoints, add header:  
   `Authorization` → `Bearer <paste_token_here>`
3. Or use Postman **Environment** with variable `token` and header:  
   `Authorization` → `Bearer {{token}}`

---

## GitHub Repository
Add your GitHub repo link to Notion, for example:
`https://github.com/YOUR_USERNAME/shopify`
