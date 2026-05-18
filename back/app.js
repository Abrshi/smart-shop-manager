import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";

import authRouter from "./routes/auth/auth.route.js";
import payment from "./routes/payment/payment.route.js";
import ownerRouter from "./routes/owner/owner.route.js";
import adminRouter from "./routes/admin/admin.route.js";
import cashierRouter from "./routes/cashier/cashier.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// ---------- Middleware ----------
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ---------- Routes ----------

// Main API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payment", payment);
app.use("/api/v1/owner", ownerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/cashier", cashierRouter);

// Google Drive image proxy route
app.get("/api/v1/google-image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Google direct image URL
    const imageUrl = `https://drive.google.com/uc?id=${id}`;

    // Fetch image from Google
    const response = await axios.get(imageUrl, {
      responseType: "stream",
    });

    // Forward content type
    res.setHeader(
      "Content-Type",
      response.headers["content-type"]
    );

    // Send image stream to frontend
    response.data.pipe(res);

  } catch (error) {
    console.error("Image loading error:", error.message);

    return res.status(500).json({
      message: "Failed to load image",
    });
  }
});

// Home route
app.get("/", (req, res) => {
  res.send({
    message: "Shop API is running...",
  });
});

// 404 handler (MUST stay near bottom)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    console.error("JSON parse error:", err.message);

    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  console.error("Server Error:", err.stack || err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});

export default app;