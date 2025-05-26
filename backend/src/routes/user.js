import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be between 5 to 10 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Signup error:", error);
      return res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  }
);

router.post(
  "/login",
  [
    body("username")
      .trim()
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be between 5 to 10 characters"),
    body("password")
      .isLength({ min: 6, max: 12 })
      .withMessage("Password must be between 6 to 12 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(400).json({
          message: "Username or password is incorrect",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Username or password is incorrect",
        });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        userID: user._id,
        username: user.username,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Server error. Please try again later.",
      });
    }
  }
);

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(authHeader, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = decoded;
    next();
  });
};

export default router;
