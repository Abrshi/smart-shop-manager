import { getUserFromRefreshToken } from "../../lib/getUserId.js";
import { prisma } from "../../lib/prisma.js";

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
