import { getUserFromRefreshToken } from "../../lib/getUserId.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";

      export const createShop = async (req, res) => {
        const { name, location } = req.body;
        const user = await getUserFromRefreshToken(req.cookies.refreshToken);
        const owner_id = user.user_id;
                console.log("Owner ID:", owner_id);
                try {
                  const shop = await prisma.shop.create({
                    data: {
                      owner_id,
                      name,
                      location
                    }
                  });
                  console.log("create the firstBranch");
                    await prisma.branch.create({
                      data: {
                        name: "Main Branch",
                        location,
                        shop_id: shop.shop_id,
                      }}).then((branch) => {
                        console.log("Branch created:", branch);
                      }).catch((error) => {
                        console.error("Error creating branch:", error);
                      });

                  res.status(201).json(shop);
                } catch (error) {
                  console.error("Error creating shop:", error);
                  res.status(500).json({ error: "Failed to create shop" });
                }
              };

      export const getShops = async (req, res) => {
        const user = await getUserFromRefreshToken(req.cookies.refreshToken);
        console.log(req.cookies);

        console.log("User from token:", user);
          const owner_id = user.user_id;
                console.log("Owner ID:", owner_id);
                try {
                  const shops = await prisma.shop.findMany({
                    where: { owner_id },
                    include: {
                      employees: {
                        include: {
                        user: {
                          select: {
                            first_name: true,
                            father_name: true,
                            phone_number: true,
                            role: true
                          }
                        }
                        },
                      },
                      branches: true,
                    },
                  });
          res.json(shops);
        } catch (error) {
          console.error("Error fetching shops:", error);
          res.status(500).json({ error: "Failed to fetch shops" });
        }
      };

      export const createBranch = async (req, res) => {
        const { name, location, shop_id } = req.body;
        console.log("Received data:", { name, location, shop_id });
        const user = await getUserFromRefreshToken(req.cookies.refreshToken);
        console.log("User from token:", user);
        const owner_id = user.user_id;
        console.log("Owner ID:", owner_id);
        try {
          // Check if the shop belongs to the owner
          const shop = await prisma.shop.findUnique({
            where: { shop_id },
          }); 
          if (!shop || shop.owner_id !== owner_id) {
            return res.status(403).json({ error: "Unauthorized to add branch to this shop" });
          }
          const branch = await prisma.branch.create({
            data: {
              name,
              location,
              shop_id,
            },
          });
         
          res.status(201).json(branch);
        } catch (error) {
          console.error("Error creating branch:", error);
          return res.status(500).json({ error: "Failed to create branch" });
        }
      };

     
      export const addEmployee = async (req, res) => {
          const { shop_id, branch_id, email, password, role, name, phone_number } = req.body;

          try {
            const shopId = Number(shop_id);
            const branchId = Number(branch_id);

            const shop = await prisma.shop.findUnique({
              where: { shop_id: shopId },
            });

            if (!shop) {
              return res.status(404).json({ error: "Shop not found" });
            }

            const branch = await prisma.branch.findUnique({
              where: { branch_id: branchId },
            });

            if (!branch) {
              return res.status(404).json({ error: "Branch not found" });
            }

            if (branch.shop_id !== shopId) {
              return res.status(400).json({ error: "Branch does not belong to this shop" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [first_name, father_name = ""] = name.split(" ");

            const result = await prisma.$transaction(async (tx) => {
              const user = await tx.user.create({
                data: {
                  email,
                  password_hash: hashedPassword,
                  role,
                  first_name,
                  father_name,
                  phone_number,
                },
              });

              const employee = await tx.employee.create({
                data: {
                  user_id: user.user_id,
                  shop_id: shopId,
                  branch_id: branchId,
                },
              });

              return { user, employee };
            });

            return res.status(201).json({
              message: "Employee added successfully",
              data: result,
            });
          } catch (error) {
            console.error("Error adding employee:", error);
            res.status(500).json({ error: "Failed to add employee" });
          }
        };

      export const getEmployees = async (req, res) => {
                const user = await getUserFromRefreshToken(req.cookies.refreshToken);
                const owner_id = user.user_id;
                console.log("Owner ID:", owner_id);
                try {
                  const employees = await prisma.employee.findMany({
                    where: {
                      shop: {
                        owner_id,
                      },
                    },
                    include: {
                      user: true,
                      shop: true,
                      branch: true,
                    },
                  });
                  res.json(employees);
                } catch (error) {
                  console.error("Error fetching employees:", error);
                  res.status(500).json({ error: "Failed to fetch employees" });
                }
              };
      export const getOwnerShopsBranchesProducts = async (
              req,
              res
            ) => {
              try {
                // Get logged-in user
                const user =
                  await getUserFromRefreshToken(
                    req.cookies.refreshToken
                  );

                  console.log("User from token:", user);

                if (!user) {
                  return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                  });
                }

                // Find all shops owned by this user
                const shops = await prisma.shop.findMany({
                  where: {
                    owner_id: user.user_id,
                  },

                  include: {
                    branches: {
                      include: {
                        products: {
                          where: {
                            isActive: true, // optional
                          },

                          orderBy: {
                            created_at: "desc",
                          },
                        },
                      },

                      orderBy: {
                        created_at: "desc",
                      },
                    },
                  },

                  orderBy: {
                    created_at: "desc",
                  },
                });

                return res.status(200).json({
                  success: true,
                  count: shops.length,
                  data: shops,
                });
              } catch (error) {
                console.error(
                  "Error fetching shops:",
                  error
                );

                return res.status(500).json({
                  success: false,
                  message:
                    "Failed to fetch shops data",
                  error: error.message,
                });
              }
            };

      export const getOwnerSalesData = async (req, res) => {
        try {
          const user = await getUserFromRefreshToken(req.cookies.refreshToken); 
          if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
          }
          const salesData = await prisma.sale.findMany({
            where: {
              branch: {
                shop: {
                  owner_id: user.user_id,
                },  
              },
            },
            include: {
              branch: true,
              user: {
                select: {
                  first_name: true,
                  father_name: true,
                      },
                    },
              items: {
                include: {
                  product: true,
                },
              },
            },
          });
          res.json(salesData);
        } catch (error) {
          console.error("Error fetching sales data:", error);
          res.status(500).json({ error: "Failed to fetch sales data" });
        }
      };