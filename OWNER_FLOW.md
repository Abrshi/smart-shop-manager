# 🧑‍💼 Owner System Flow – Shop Management System

## 1. 🔐 Authentication & Onboarding

### Step 1: Sign In
- Owner logs into the system using credentials.

### Step 2: Onboarding Page
- After login, owner is redirected to `/onboarding`
- Owner can:
  - View available **subscription/payment plans**
  - Compare features (price, duration, limits, etc.)

### Step 3: Plan Selection
- Owner selects a plan
- Redirected to **Chapa Payment Gateway**

### Step 4: Payment (Chapa)
- Owner completes payment via Chapa
- After successful payment:
  - Redirected to `/owner`
  - Payment status stored in database

---

## 2. 🏠 Owner Dashboard Structure

After payment, owner gets access to full system.

---

### 📊 1. Dashboard
Overview of business performance:
- Total Sales (daily, weekly, monthly)
- Total Revenue
- Top Selling Products
- Low Selling Products
- Recent Transactions
- Sales Graph (trend over time)
- Active Branch Summary

---

### 📦 2. Products
Manage all products in the system:
- View all products (list/grid)
- Add new product
- Edit product details
- Delete product
- Product fields:
  - Name
  - Price
  - Category
  - Stock Quantity
  - Description
  - Image
- Filter & Search products

---

### 💰 3. Sales
Detailed sales insights:
- All sales transactions
- Filter by:
  - Date
  - Branch
  - Employee
- Metrics:
  - Total sales count
  - Revenue generated
- Top selling items
- Low selling items
- Sales per branch
- Sales per employee

---

### 📦 4. Inventory
Track stock like a hawk 🦅:
- Current stock levels
- Low stock alerts
- Out of stock products
- Stock history (in/out logs)
- Add stock (restock)
- Transfer stock between branches

---

### 👨‍💼 5. Employees
Manage staff accounts:
- Add Employee:
  - Roles:
    - Admin
    - Shopkeeper
- Assign to branch
- Suspend / Activate account
- Remove employee

#### Employee Creation Flow:
- Owner creates account (email + password)
- Assigns role
- Employee logs in → redirected to their dashboard

---

### 🧑‍🤝‍🧑 6. Customers(i wdnt do thses write now)
Customer relationship view:
- List of customers
- Customer purchase history
- Total spent per customer
- Most frequent customers
- Contact info 

---

### 📑 7. Reports
Deep insights & exports:
- Sales Reports (daily, monthly, yearly)
- Inventory Reports
- Employee Performance Reports
- Export as:
  - PDF
  - CSV
- Profit & Loss summary

---

### 🏪 8. Shop Management

#### Initial Setup (After Payment)
- Owner must create main shop:
  - Shop Name
  - Location

- System automatically treats this as:
  👉 **Main Branch**

#### Branch Management:
- Create new branches
- View all branches
- Assign employees to branches
- See:
  - Active staff per branch
  - Branch performance
  - Branch sales

---

## 🔄 3. Role Switching

Owner can switch between roles:
- Owner View
- Admin View
- Shopkeeper View

> Allows full simulation of system roles

---

## 💳 4. Billing Section

- Current subscription plan
- Expiration date
- Upgrade / Downgrade plan
- Payment history
- Renew subscription (via Chapa)

---

## 🔁 Flow Summary

1. Sign In  
2. Onboarding → Select Plan  
3. Pay via Chapa  
4. Redirect to `/owner`  
5. Create Shop  
6. Start Managing:
   - Products
   - Sales
   - Inventory
   - Employees
   - Customers
   - Reports  

---

## 🧠 Notes for Backend Design

- Owner must have:
  - `hasActiveSubscription`
  - `shopId`
- Middleware should:
  - Block access if no payment
  - Redirect to onboarding if unpaid

---