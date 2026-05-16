import { getUserFromRefreshToken } from "../../lib/getUserId.js";
import { prisma } from "../../lib/prisma.js";

export const getScanedProducts = async (req, res) => {
  try {
    // =========================
    // GET USER
    // =========================
    const user = await getUserFromRefreshToken(
      req.cookies.refreshTokeN
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // =========================
    // GET BODY
    // =========================
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Scan code is required",
      });
    }

    // =========================
    // FIND PRODUCT
    // SUPPORT:
    // - QR CODE
    // - BARCODE
    // =========================
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          {
            qrcode: code,
          },
          {
            barcode: code,
          },
        ],

        // OPTIONAL:
        // ONLY USER PRODUCTS
        employee: {
          user_id: user.user_id,
        },
      },
    });

    // =========================
    // PRODUCT NOT FOUND
    // =========================
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =========================
    // OUT OF STOCK
    // =========================
    if (product.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product out of stock",
      });
    }

    // =========================
    // SUCCESS
    // =========================
    return res.status(200).json({
      success: true,

      product_id: product.product_id,

      name: product.name,

      price: product.price,

     image: product.image,

      barcode: product.barcode,

      qr_code: product.qrcode,

      quantity: product.quantity,

      scanned_code: code,
    });
  } catch (error) {
    console.log("SCAN PRODUCT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

export const verifyTotal = async (req, res) => {
  
  try {
    const { products } = req.body;
    // VALIDATE
    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Products are required",
      });
    }

    let total = 0;

    const updatedProducts = [];

    // LOOP PRODUCTS
    for (const item of products) {
      const {
        code,
        quantity,
      } = item;

      if (!code || !quantity) {
        return res.status(400).json({
          success: false,
          error:
            "Code and quantity are required",
        });
      }

      // FIND PRODUCT USING
      // QR CODE OR BARCODE
      const product =
        await prisma.product.findFirst({
          where: {
            OR: [
              {
                barcode: code,
              },
              {
                qrcode: code,
              },
            ],
          },
        });

      // PRODUCT NOT FOUND
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found for code ${code}`,
        });
      }

      // CHECK STOCK
      if (
        product.quantity <
        quantity
      ) {
        return res.status(400).json({
          success: false,
          error: `${product.name} is out of stock`,
        });
      }

      // CALCULATE REAL PRICE
      total +=
        product.price * quantity;

      updatedProducts.push({
        product_id:
          product.product_id,
        quantity,
      });
    }

    // UPDATE STOCK
    for (const item of updatedProducts) {
      await prisma.product.update({
        where: {
          product_id:
            item.product_id,
        },

        data: {
          quantity: {
            decrement:
              item.quantity,
          },
        },
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Checkout confirmed",
      total,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error:
        "Internal server error",
    });
  }
};
export const verifyCheckout = async (
  req,
  res
) => {
  try {
    // GET USER
    const user =
      await getUserFromRefreshToken(
        req.cookies.refreshToken
      );
  console.log("User from token:", user);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { products } = req.body;

    // VALIDATE PRODUCTS
    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Products are required",
      });
    }

    // GET EMPLOYEE (CASHIER)
    const employee =
      await prisma.employee.findFirst(
        {
          where: {
            user_id:
              user.user_id,
          },
        }
      );

    if (!employee) {
      return res.status(404).json({
        success: false,
        error:
          "Employee not found",
      });
    }

    // VALIDATE QUANTITY
    for (const item of products) {
      if (
        !item.quantity ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          error: `Invalid quantity for ${item.code}`,
        });
      }
    }

    // GET ALL CODES
    const codes = products.map(
      (p) => p.code
    );

    // GET PRODUCTS FROM EMPLOYEE BRANCH
    const dbProducts =
      await prisma.product.findMany({
        where: {
          branch_id:
            employee.branch_id,

          OR: [
            {
              barcode: {
                in: codes,
              },
            },
            {
              qrcode: {
                in: codes,
              },
            },
          ],
        },
      });

    // CREATE PRODUCT MAP
    const productMap =
      new Map();

    for (const product of dbProducts) {
      if (product.barcode) {
        productMap.set(
          product.barcode,
          product
        );
      }

      if (product.qrcode) {
        productMap.set(
          product.qrcode,
          product
        );
      }
    }

    let total = 0;
    const saleItems = [];

    // VERIFY PRODUCTS
    for (const item of products) {
      const {
        code,
        quantity,
      } = item;

      const product =
        productMap.get(code);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${code}`,
        });
      }

      // CHECK STOCK
      if (
        product.quantity <
        quantity
      ) {
        return res.status(400).json({
          success: false,
          error: `${product.name} out of stock`,
        });
      }

      // TOTAL
      total +=
        product.price *
        quantity;

      saleItems.push({
        product_id:
          product.product_id,
        quantity,
        price:
          product.price,
      });
    }

    // TRANSACTION
    const sale =
      await prisma.$transaction(
        async (tx) => {
          // CREATE SALE
          const createdSale =
            await tx.sale.create({
              data: {
                user_id:
                  user.user_id,
                total,
              },
            });

          // SAFE STOCK UPDATE
          for (const item of saleItems) {
            const updated =
              await tx.product.updateMany(
                {
                  where: {
                    product_id:
                      item.product_id,
                    quantity: {
                      gte:
                        item.quantity,
                    },
                  },
                  data: {
                    quantity: {
                      decrement:
                        item.quantity,
                    },
                  },
                }
              );

            // PREVENT OVERSELLING
            if (
              updated.count ===
              0
            ) {
              throw new Error(
                "Insufficient stock"
              );
            }
          }

          // CREATE SALE ITEMS
          await tx.saleItem.createMany(
            {
              data:
                saleItems.map(
                  (item) => ({
                    sale_id:
                      createdSale.sale_id,
                    product_id:
                      item.product_id,
                    quantity:
                      item.quantity,
                    price:
                      item.price,
                  })
                ),
            }
          );

          return createdSale;
        }
      );

    return res.status(200).json({
      success: true,
      total,
      sale_id:
        sale.sale_id,
      message:
        "Checkout successful",
    });
  } catch (error) {
    console.log(
      "VERIFY CHECKOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Internal server error",
    });
  }
};