import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";

import authRouter from "./routes/auth/auth.route.js";
import payment from "./routes/payment/payment.route.js";
// admin routes

// user routes

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

// JSON parser
app.use(express.json());

// ---------- Routes ----------

// comen 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payment", payment);

app.get("/", (req, res) => {
  res.send({ message: "Shop API is running..." });
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});



// Global error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("⚠️ JSON parse error:", err.message);
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  console.error("💥 Server Error:", err.stack || err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;