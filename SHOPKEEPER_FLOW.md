# 🧑‍💻 Shopkeeper System Flow – Shop Management System

## 1. 🔐 Authentication

### Step 1: Account Creation
- Created by Owner or Admin
- Assigned:
  - Role: Shopkeeper
  - Branch

### Step 2: Sign In
- Logs in using credentials
- Redirected to `/shopkeeper`

---

## 2. 🛒 Shopkeeper Dashboard (POS System)

This is a **Point of Sale (POS)** interface focused on speed and simplicity.

---

### 🔍 1. Product Scanning (Core Feature)

#### Supported Methods:
- Barcode Scanner (MANDATORY)
- QR Code Scanner (MANDATORY)

> All products must have a barcode or QR code

#### Flow:
1. Scan product
2. System instantly:
   - Finds product
   - Adds to cart
   - Displays:
     - Name
     - Price
     - Available stock

#### Bulk Purchase Case:
- Example: Customer buys 100 toothpaste
  - Scan once
  - Manually update quantity → `100`

---

### 🧾 2. Cart Management

#### Features:
- List of scanned products
- Quantity control:
  - Increase / Decrease
  - Manual input
- Remove item
- Auto price calculation

#### Cart Summary:
- Subtotal
- Tax (if applied)
- Discount (optional)
- Grand Total

---

### 💳 3. Checkout & Payment

#### Payment Methods:
- Cash
- Mobile Payment (optional)
- Card (optional)

#### Actions:
- Confirm sale
- Generate receipt

#### After Payment:
- Save transaction
- Reduce inventory automatically
- Clear cart

---

### 🧾 4. Receipt System

- Generate printable receipt:
  - Shop name
  - Items purchased
  - Quantity
  - Price
  - Total
  - Date & Time
  - Shopkeeper name

---

### 📦 5. Quick Inventory Awareness

Shopkeeper cannot manage inventory fully, but can:

- See stock availability while selling
- Get alerts:
  - Low stock warning
  - Out of stock block

> ❗ Cannot edit stock manually

---

### 🔄 6. Sales History (Limited)

- View recent transactions
- Filter by:
  - Today
  - This shift
- View receipt details

> ❗ Cannot edit or delete sales

---

### 👤 7. Account Actions

- Logout
- Change password

#### Restrictions:
- ❌ Cannot change email
- ❌ Cannot access admin or owner settings

---

## 🔒 Permissions Summary

| Feature              | Shopkeeper Access |
|--------------------|------------------|
| Scan Products       | ✅ Yes           |
| Manual Quantity     | ✅ Yes           |
| Checkout            | ✅ Yes           |
| Inventory View      | ✅ Limited       |
| Inventory Edit      | ❌ No            |
| Sales History       | ✅ Limited       |
| Reports             | ❌ No            |
| Employees           | ❌ No            |
| Change Password     | ✅ Yes           |
| Logout              | ✅ Yes           |

---

## 🔁 Flow Summary

1. Login  
2. Scan product  
3. Add to cart  
4. Adjust quantity (if needed)  
5. Checkout  
6. Generate receipt  
7. Repeat 🔁  

---

## 🧠 Backend Notes

### Key Models:
- `Sale`
- `SaleItem`
- `Product`
- `Inventory`

---

### Important Logic:

#### Scan Product API: