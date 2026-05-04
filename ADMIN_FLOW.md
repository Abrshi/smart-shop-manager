# 🧑‍💼 Admin System Flow – Shop Management System

## 1. 🔐 Authentication

### Step 1: Account Creation
- Admin account is created by the Owner
- Owner assigns:
  - Role: Admin
  - Branch

### Step 2: Sign In
- Admin logs in using provided credentials
- Redirected to `/admin`

---

## 2. 🏠 Admin Dashboard Structure

Admin focuses on **operations**, not billing or system-level control.

---

### 📊 1. Dashboard
Quick operational overview:
- Today's Sales
- Total Orders
- Low Stock Alerts
- Top Selling Products
- Recent Sales Activity
- Assigned Branch Summary

---

### 📦 2. Products Management

Admin has full control over products:

#### Actions:
- Add new product
- Edit existing product
- Delete product
- View product list

#### Product Fields:
- Name
- Price
- Category
- Stock Quantity
- Description
- Image

#### Features:
- Search & filter
- Category grouping
- Stock status indicator (In stock / Low / Out)

---

### 📦 3. Inventory Management

This is the admin’s playground of boxes and numbers 📦

#### Features:
- View current stock levels
- Low stock alerts
- Out of stock items
- Stock history (logs of:
  - Added stock
  - Sold stock
)

#### Actions:
- Add stock (restock)
- Update stock quantity
- Transfer stock between branches (if allowed)

---

### 💰 4. Sales Monitoring

Admin can observe and track sales:

#### Features:
- View all sales transactions
- Filter by:
  - Date
  - Product
  - Employee
- Metrics:
  - Total sales
  - Revenue
- Top selling products
- Low selling products

> ❗ Admin typically **cannot delete or manipulate sales records** (for integrity)

---

### 👨‍💼 5. Employees (Limited Control)

Admin has **partial control** over employees:

#### Actions:
- View employees in their branch
- Assign roles (if allowed by owner)
- Activate / Suspend employees

> ❗ Admin cannot create other Admins (optional rule based on your system design)

---
## 🔐 6. Account & Security Settings

Admin can manage their own account:

### Actions:
- Logout from system
- Change password
- View account info

### Restrictions:
- ❌ Cannot change email (controlled by owner/system)
- ❌ Cannot delete own account

---

## 🔄 7. Role Switching (Access Shopkeeper Panel)

Admin can switch to **Shopkeeper Mode**:

### Features:
- Access Shopkeeper dashboard (`/shopkeeper`)
- Perform sales (POS system)
- Handle customer transactions directly

> This allows admin to act as a fallback shopkeeper when needed

### Behavior:
- Switch Mode Button in UI
- No need to re-login
- Session stays the same, role context changes

---

## 🔒 Updated Permissions Summary

| Feature                     | Admin Access |
|--------------------------|-------------|
| Products                  | ✅ Full     |
| Inventory                 | ✅ Full     |
| Sales Viewing             | ✅ Yes      |
| Sales Editing             | ❌ No       |
| Employees                 | ⚠️ Limited  |
| Customers                 | ✅ View     |
| Reports                   | ✅ Limited  |
| Billing                   | ❌ No       |
| Shop Settings             | ❌ No       |
| Change Password           | ✅ Yes      |
| Logout                    | ✅ Yes      |
| Change Email              | ❌ No       |
| Access Shopkeeper Panel   | ✅ Yes      |

---

## 🧠 Backend Notes (Important Update)

### Auth & Security:
- Add route:
  - `POST /auth/logout`
  - `PUT /auth/change-password`

### Role Switching Logic:
- Do NOT change role in DB
- Use **temporary session mode**:
  ```js
  {
    user_id: 1,
    role: "ADMIN",
    active_mode: "SHOPKEEPER" // or "ADMIN"
  }