import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";

// ---------------- Token Helpers ----------------
export const generateAccessToken = (user) =>
  jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = () =>
  crypto.randomBytes(64).toString("hex");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ---------------- Cookie Options ----------------
const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
export { accessCookieOptions, refreshCookieOptions };

// ---------------- SignUp ----------------
export const signUp = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    const existing = await prisma.user.findUnique({
      where: { phone_number },
    });

    if (existing)
      return res.status(409).json({ error: "Phone number already exists" });

    // Split the name into parts
    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0] || "";
    const father_name = nameParts[1] || "";
    const grandfather_name = nameParts[2] || "";

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        first_name,
        father_name,
        grandfather_name,
        email,
        phone_number,
        password_hash: passwordHash,
      },
    });
    
    res.status(201).json({
      message: "User created",
      user: {
        id: user.user_id,
        first_name: user.first_name,
        father_name: user.father_name,
        grandfather_name: user.grandfather_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("❌ SignUp error:", err);
    console.log("error details:", err); 
    res.status(500).json({ error: "Server error",err });
  }
};

// ---------------- SignIn ----------------
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email},
    });

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    // Delete old sessions
    await prisma.session.deleteMany({
      where: { user_id: user.user_id },
    });

    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashToken(refreshToken);

    await prisma.session.create({
      data: {
        refreshToken: hashedRefreshToken,
        user: { connect: { user_id: user.user_id } },
      },
    });

    const accessToken = generateAccessToken({
      user_id: user.user_id,
      role: user.role,
    });

    console.log("Generated Access Token:", accessToken);

    res
      .cookie("accessToken", accessToken, accessCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .json({
        message: "Logged in",
        user: {
          id: user.user_id,
          first_name: user.first_name,
          father_name: user.father_name,
          grandfather_name: user.grandfather_name,
          email: user.email,
          role: user.role, // use directly from the user
        },
      });
  } catch (err) {
    console.error("SignIn Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ---------------- re auth ----------------
export const reAuth = async (cookies) => {
  console.log("Re-authenticating user with cookies:", cookies);

  try {
    if (!cookies) {
      return { error: "No refresh token provided" };
    }

    const hashedToken = hashToken(cookies);

    // 1. Find session + user
    const session = await prisma.session.findFirst({
      where: { refreshToken: hashedToken },
      include: { user: true },
    });

    if (!session) {
      return { error: "Invalid credentials" };
    }

    const user = session.user;

    // 2. Generate new tokens
    const newRefreshToken = generateRefreshToken();
    const hashedNewRefreshToken = hashToken(newRefreshToken);

    const accessToken = generateAccessToken({
      user_id: user.user_id,
      role: user.role,
    });

    // 3. Rotate refresh token (IMPORTANT)
    await prisma.session.update({
      where: { session_id: session.session_id },
      data: {
        refreshToken: hashedNewRefreshToken,
      },
    });

    // 4. return data (no res here)
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.user_id,
        first_name: user.first_name,
        father_name: user.father_name,
        grandfather_name: user.grandfather_name,
        email: user.email,
        role: user.role,
      },
    };

  } catch (err) {
    console.error("ReAuth Error:", err);
    return { error: "Server error" };
  }
};
// ---------------- Get Current User ----------------
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token)
      return res.status(401).json({ error: "No access token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { user_id: decoded.user_id },
    });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ---------------- Refresh Token ----------------
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  
  if (!token)
    return res.status(401).json({ error: "No refresh token" });

  try {
    console.log(token)
    const hashedToken = hashToken(token);

    const session = await prisma.session.findFirst({
      where: { refreshToken: hashedToken },
      include: { user: true },
    });

    if (!session)
      return res.status(403).json({ error: "Invalid refresh token" });

    const newRefreshToken = generateRefreshToken();
    const newHashedToken = hashToken(newRefreshToken);

    // ✅ FIXED HERE
    await prisma.session.update({
      where: { session_id: session.session_id },
      data: { refreshToken: newHashedToken },
    });

    const newAccessToken = generateAccessToken({
      user_id: session.user.user_id,
      role: session.user.role,
    });

    res
      .cookie("accessToken", newAccessToken, accessCookieOptions)
      .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
      .json({ message: "Token refreshed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// ---------------- Logout ----------------
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      await prisma.session.deleteMany({
        where: { refreshToken: hashToken(token) },
      });
    }

    res
      .clearCookie("accessToken", accessCookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions)
      .json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};