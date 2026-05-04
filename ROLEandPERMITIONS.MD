| Feature / Action        | Owner 👑 | Admin 🧭   | Shopkeeper 💳 |
| ----------------------- | -------- | ---------- | ------------- |
| View Dashboard          | ✅        | ✅          | ✅ (limited)   |
| Manage Subscription     | ✅        | ❌          | ❌             |
| View Billing            | ✅        | ❌          | ❌             |
| Create Shop             | ✅        | ❌          | ❌             |
| Create Branch           | ✅        | ❌          | ❌             |
| View Branches           | ✅        | ✅          | ❌             |
| Manage Products         | ✅        | ✅          | ❌             |
| Add Product             | ✅        | ✅          | ❌             |
| Edit Product            | ✅        | ✅          | ❌             |
| Delete Product          | ✅        | ✅          | ❌             |
| View Inventory          | ✅        | ✅          | ✅ (read)      |
| Manage Inventory        | ✅        | ✅          | ❌             |
| View Sales              | ✅        | ✅          | ✅ (own)       |
| Create Sale (POS)       | ❌        | ✅          | ✅             |
| Edit/Delete Sales       | ❌        | ❌          | ❌             |
| View Reports            | ✅        | ✅          | ❌             |
| Manage Employees        | ✅        | ⚠️ Limited | ❌             |
| Create Admin            | ✅        | ❌          | ❌             |
| Create Shopkeeper       | ✅        | ✅          | ❌             |
| Suspend Employee        | ✅        | ✅          | ❌             |
| View Customers          | ✅        | ✅          | ❌             |
| Switch Role Mode        | ✅        | ✅          | ❌             |
| Access Admin Panel      | ✅        | ✅          | ❌             |
| Access Shopkeeper Panel | ✅        | ✅          | ✅             |
| Change Password         | ✅        | ✅          | ✅             |
| Logout                  | ✅        | ✅          | ✅             |
| Change Email            | ❌        | ❌          | ❌             |



Prisma Schema – Roles & Permissions
🧑‍🤝‍🧑 Role Model
model Role {
  role_id    Int     @id @default(autoincrement())
  name       String  @unique // OWNER, ADMIN, SHOPKEEPER

  users      User[]
  permissions RolePermission[]

  @@map("Roles")
}
🔐 Permission Model
model Permission {
  permission_id Int     @id @default(autoincrement())
  name          String  @unique // CREATE_PRODUCT, VIEW_SALES, etc

  roles         RolePermission[]

  @@map("Permissions")
}
🔗 RolePermission (Many-to-Many)

This connects roles ↔ permissions

model RolePermission {
  role_id       Int
  permission_id Int

  role          Role       @relation(fields: [role_id], references: [role_id])
  permission    Permission @relation(fields: [permission_id], references: [permission_id])

  @@id([role_id, permission_id])
  @@map("RolePermissions")
}
👤 Update Your User Model

Add role connection:

model User {
  user_id   Int    @id @default(autoincrement())
  email     String @unique
  password  String

  role_id   Int
  role      Role   @relation(fields: [role_id], references: [role_id])

  created_at DateTime @default(now())

  @@map("Users")
}
🌱 Seed Data (VERY IMPORTANT)

This is where your system gets its “personality” 🎭

1. Roles
INSERT INTO Roles (name) VALUES
('OWNER'),
('ADMIN'),
('SHOPKEEPER');
2. Permissions
INSERT INTO Permissions (name) VALUES
('CREATE_PRODUCT'),
('EDIT_PRODUCT'),
('DELETE_PRODUCT'),
('VIEW_PRODUCT'),

('VIEW_INVENTORY'),
('MANAGE_INVENTORY'),

('CREATE_SALE'),
('VIEW_SALES'),

('CREATE_EMPLOYEE'),
('SUSPEND_EMPLOYEE'),

('CREATE_BRANCH'),
('VIEW_BRANCH'),

('MANAGE_SUBSCRIPTION'),
('VIEW_BILLING');
3. Assign Permissions to Roles
👑 OWNER (gets everything)
-- give all permissions to OWNER
INSERT INTO RolePermissions (role_id, permission_id)
SELECT 1, permission_id FROM Permissions;
🧭 ADMIN
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(2, 1), -- CREATE_PRODUCT
(2, 2), -- EDIT_PRODUCT
(2, 3), -- DELETE_PRODUCT
(2, 4), -- VIEW_PRODUCT

(2, 5), -- VIEW_INVENTORY
(2, 6), -- MANAGE_INVENTORY

(2, 7), -- CREATE_SALE
(2, 8), -- VIEW_SALES

(2, 10), -- SUSPEND_EMPLOYEE
(2, 12); -- VIEW_BRANCH
💳 SHOPKEEPER
INSERT INTO RolePermissions (role_id, permission_id) VALUES
(3, 7), -- CREATE_SALE
(3, 8); -- VIEW_SALES
⚙️ How You Use This in Backend

Instead of:

if (user.role === "ADMIN")

You evolve into:

if (user.permissions.includes("CREATE_PRODUCT"))
🧠 Practical Middleware Example
const checkPermission = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user.permissions.includes(permission)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

Usage:

router.post("/product", checkPermission("CREATE_PRODUCT"), createProduct);
🧬 Final Structure (Mental Picture)
User
 └── Role
       └── Permissions (many)