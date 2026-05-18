import { getUserFromRefreshToken } from "../../lib/getUserId.js";
import { uploadFileToDrive } from "../../lib/googleDrive.js";
import { prisma } from "../../lib/prisma.js";

      export const getEmployeeBranches = async (req, res) => {
        try {
          // get logged in user
          const user = await getUserFromRefreshToken(
            req.cookies.refreshToken
          );
          console.log("User from token:", user);

          if (!user) {
            return res.status(401).json({
              success: false,
              error: "Unauthorized",
            });
          }

          // find employee
          const employee = await prisma.employee.findFirst({
            where: {
              user_id: user.user_id,
            },
            include: {
              branch: true,
            },
          });

          if (!employee) {
            return res.status(404).json({
              success: false,
              error: "Employee not found",
            });
          }

          // return branch
          return res.status(200).json({
            success: true,
            branches: [employee.branch],
          });

        } catch (error) {
          console.error("Get Branch Error:", error);

          return res.status(500).json({
            success: false,
            error: "Failed to fetch branches",
          });
        }
      };

      export const addNewProduct = async (req, res) => {
        try {
          const {
            name,
            price,
            quantity,
            barcode,
            qrcode,
            type,
            minStock,
            brand,
            description,
            branch_id,
          } = req.body;

          const image = req.file;

          // =========================
          // VALIDATION
          // =========================

          if (!image) {
            return res.status(400).json({
              success: false,
              error: "Product image is required",
            });
          }

          if (!name || !price || !quantity || !branch_id) {
            return res.status(400).json({
              success: false,
              error: "Please fill all required fields",
            });
          }

          // =========================
          // AUTH USER
          // =========================

          const user = await getUserFromRefreshToken(
            req.cookies.refreshToken
          );

          if (!user) {
            return res.status(401).json({
              success: false,
              error: "Unauthorized",
            });
          }

          // =========================
          // FIND EMPLOYEE
          // =========================

          const employee = await prisma.employee.findFirst({
            where: {
              user_id: user.user_id,
            },
          });

          if (!employee) {
            return res.status(404).json({
              success: false,
              error: "Employee not found",
            });
          }

          // =========================
          // BRANCH VALIDATION
          // =========================

          if (employee.branch_id !== parseInt(branch_id)) {
            console.log(
              `Employee branch (${employee.branch_id}) does not match selected branch (${branch_id})`
            );

            return res.status(403).json({
              success: false,
              error: "You are not assigned to this branch",
            });
          }

          // =========================
          // CHECK DUPLICATES
          // =========================

          if (barcode) {
            const existingBarcode =
              await prisma.product.findUnique({
                where: {
                  barcode,
                },
              });

            if (existingBarcode) {
              return res.status(400).json({
                success: false,
                error: "Barcode already exists",
              });
            }
          }

          if (qrcode) {
            const existingQrCode =
              await prisma.product.findUnique({
                where: {
                  qrcode,
                },
              });

            if (existingQrCode) {
              return res.status(400).json({
                success: false,
                error: "QR Code already exists",
              });
            }
          }

          // =========================
          // UPLOAD IMAGE
          // =========================

          const driveResult = await uploadFileToDrive(image);

            // if Google returns file id directly
            const driveId = driveResult.id;

            const imageUrl = `${process.env.BACKEND_URL}/api/v1/google-image/${driveId}`;
            
          if (!imageUrl) {
            console.error("Image upload failed");

            return res.status(500).json({
              success: false,
              error: "Failed to upload product image",
            });
          }

          console.log("Uploaded image URL:", imageUrl);

          // =========================
          // CREATE PRODUCT
          // =========================

          const product = await prisma.product.create({
            data: {
              name,
              price: parseFloat(price),
              quantity: parseInt(quantity),
              barcode: barcode || null,
              qrcode: qrcode || null,
              type,
              minStock: minStock
                ? parseInt(minStock)
                : 0,
              brand,
              description,
              image: imageUrl,

              employee_id: employee.employee_id,
              branch_id: parseInt(branch_id),
            },
          });

          // =========================
          // SUCCESS RESPONSE
          // =========================

          return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
          });

        } catch (error) {
          console.error("Create Product Error:", error);

          return res.status(500).json({
            success: false,
            error: "Failed to create product",
          });
        }
      };

      export const editProduct = async (req, res) => {
        try {
          const {
            name,
            price,
            quantity,
            barcode,
            qrcode,
            type,
            minStock,
            brand,
            description,
            branch_id,
          } = req.body;
          const { id } = req.params;

          const image = req.file;

          // =========================
          // VALIDATION
          // =========================

          if (!image) {
            return res.status(400).json({
              success: false,
              error: "Product image is required",
            });
          }

          if (!name || !price || !quantity || !branch_id) {
            return res.status(400).json({
              success: false,
              error: "Please fill all required fields",
            });
          }

          // =========================
          // AUTH USER
          // =========================

          const user = await getUserFromRefreshToken(
            req.cookies.refreshToken
          );

          if (!user) {
            return res.status(401).json({
              success: false,
              error: "Unauthorized",
            });
          }

          // =========================
          // FIND EMPLOYEE
          // =========================

          const employee = await prisma.employee.findFirst({
            where: {
              user_id: user.user_id,
            },
          });

          if (!employee) {
            return res.status(404).json({
              success: false,
              error: "Employee not found",
            });
          }

          // =========================
          // BRANCH VALIDATION
          // =========================

          if (employee.branch_id !== parseInt(branch_id)) {
            console.log(
              `Employee branch (${employee.branch_id}) does not match selected branch (${branch_id})`
            );

            return res.status(403).json({
              success: false,
              error: "You are not assigned to this branch",
            });
          }

          
          // =========================
          // UPLOAD IMAGE
          // =========================

          const googleUrl = await uploadFileToDrive(image);

// Extract ID from Google URL
const match = googleUrl.match(/id=([a-zA-Z0-9_-]+)/);
const driveId = match ? match[1] : null;

// Build your API URL
const imageUrl = driveId
  ? `${process.env.BACKEND_URL}/api/v1/google-image/${driveId}`
  : null;
          if (!imageUrl) {
            console.error("Image upload failed");

            return res.status(500).json({
              success: false,
              error: "Failed to upload product image",
            });
          }

          console.log("Uploaded image URL:", imageUrl);

          // =========================
          // update PRODUCT
          // =========================

          const product = await prisma.product.update({
            where: {
              product_id: parseInt(id),
            },
            data: {
              name,
              price: parseFloat(price),
              quantity: parseInt(quantity),
              barcode: barcode || null,
              qrcode: qrcode || null,
              type,
              minStock: minStock
                ? parseInt(minStock)
                : 0,
              brand,
              description,
              image: imageUrl,

              employee_id: employee.employee_id,
              branch_id: parseInt(branch_id),
            },
          });

          // =========================
          // SUCCESS RESPONSE
          // =========================

          return res.status(201).json({
            success: true,
            message: "Product updated successfully",
            product,
          });

        } catch (error) {
          console.error("Update Product Error:", error);

          return res.status(500).json({
            success: false,
            error: "Failed to update product",
          });
        }
      };

      export const getProducts = async (req, res) => {
        // GET USER ID FROM TOKEN
        const user = await getUserFromRefreshToken( req.cookies.refreshTokeN );
        if (!user) {
          return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        try {
          const shop = await prisma.shop.findFirst({
            where: {
              owner_id: user.user_id,
            },
          });
          if (!shop) {
            return res.status(404).json({ success: false, error: "Shop not found" });
          }
          const branch = await prisma.branch.findFirst({
            where: {
              shop_id: shop.shop_id,
            },
          });
          const product = await prisma.product.findMany({
            where: {
              branch_id: branch.branch_id,
            },
          });
          if (!product || product.length === 0) {
            return res.status(404).json({ success: false, error: "Product not found" });
          }
          return res.status(200).json({ success: true, product });
        } catch (error) {
          console.error("Get Product Error:", error);
          return res.status(500).json({ success: false, error: "Failed to get product" });
        }
      };

      export const addExistingProduct = async (req, res) => {
      try {
      const { quantity, barcode, qrcode } = req.body;

      // =========================
      // VALIDATION
      // =========================
      if (!quantity || (!barcode && !qrcode)) {
      return res.status(400).json({
        success: false,
        error: "Please fill all required fields",
      });
      }

      // =========================
      // FIND PRODUCT
      // =========================
      let product = null;

      // SEARCH BY BARCODE
      if (barcode) {
      product = await prisma.product.findUnique({
        where: {
          barcode,
        },
      });
      }

      // SEARCH BY QRCODE
      if (!product && qrcode) {
      product = await prisma.product.findUnique({
        where: {
          qrcode,
        },
      });
      }

      // PRODUCT NOT FOUND
      if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
      }

      // =========================
      // UPDATE PRODUCT
      // =========================
      const updatedProduct = await prisma.product.update({
      where: {
        product_id: product.product_id,
      },
      data: {
        quantity: {
          increment: parseInt(quantity),
        },
      },
      });

      // =========================
      // SUCCESS
      // =========================
      return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
      });

      } catch (error) {
      console.error("Update Product Error:", error);

      return res.status(500).json({
      success: false,
      error: "Failed to update product",
      });
      }
      };

      export const lowStockProducts = async (req, res) => {
  try {
    // GET USER ID FROM TOKEN
    const user = await getUserFromRefreshToken(
      req.cookies.refreshTokeN
    );

    if (!user) {
      console.log("Unauthorized access attempt to low stock products");
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    // FIND SHOP
    const shop = await prisma.shop.findFirst({
      where: {
        owner_id: user.user_id,
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    // FIND BRANCH
    const branch = await prisma.branch.findFirst({
      where: {
        shop_id: shop.shop_id,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        error: "Branch not found",
      });
    }

    // LOW STOCK PRODUCTS
    const lowStockProducts = await prisma.$queryRaw`
      SELECT *
      FROM "Products"
      WHERE branch_id = ${branch.branch_id}
      AND quantity <= "minStock"
      AND "isActive" = true
    `;

    return res.status(200).json({
      success: true,
      products: lowStockProducts,
    });

  } catch (error) {
    console.error("Low Stock Products Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch low stock products",
    });
  }
      };

      export const analyticsForSoledItems = async (req, res) => {
        try {
          const user = await getUserFromRefreshToken(req.cookies.refreshToken);

          if (!user) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
          }

          const employee = await prisma.employee.findFirst({
            where: { user_id: user.user_id },
          });

          if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
          }

          const sales = await prisma.sale.findMany({
            where: {
              user: {
                employees: {
                  some: {
                    branch_id: employee.branch_id,
                  },
                },
              },
            },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          const allItems = sales.flatMap((sale) =>
            sale.items.map((item) => ({
              ...item,
              sale_created_at: sale.created_at,
              sale_id: sale.sale_id,
            }))
          );

          const analyticsMap = new Map();

          for (const item of allItems) {
            const product = item.product;

            if (!analyticsMap.has(item.product_id)) {
              analyticsMap.set(item.product_id, {
                productId: item.product_id,
                productName: product?.name || "Unknown",

                // 📊 core metrics
                quantitySold: 0,
                totalRevenue: 0,
                salesCount: 0,

                // 📦 product info
                currentStock: product?.quantity || 0,
                price: product?.price || 0,

                // 🕒 tracking
                lastSold: null,
              });
            }

            const data = analyticsMap.get(item.product_id);

            data.quantitySold += item.quantity;
            data.totalRevenue += item.quantity * item.price;
            data.salesCount += 1;

            // last sold tracking
            if (!data.lastSold || item.sale_created_at > data.lastSold) {
              data.lastSold = item.sale_created_at;
            }
          }

          const result = Array.from(analyticsMap.values()).map((p) => ({
            ...p,
            avgSellingPrice:
              p.salesCount > 0 ? p.totalRevenue / p.quantitySold : 0,
          }));

          return res.status(200).json({
            success: true,
            analytics: result,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            error: "Failed to fetch analytics",
          });
        }
      };