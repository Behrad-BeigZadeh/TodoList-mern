import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import {body , validationResult} from "express-validator";

const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be between 5 to 10 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
      }
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ username, password: hashedPassword });
      await newUser.save();
      res.json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
   
  }
);

router.post(
  "/login",
  [
    body("username")
      .isLength({ min: 5, max: 10 })
      .withMessage("Username must be between 5 to 10 characters"),
    body("password")
      .isLength({ min: 6, max:12 })
      .withMessage("Password must be between 6 to 12 characters"),
  ],
  async (req, res) => {
    try {  const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(401).json({ errors: errors.array() })
      }
      const { username, password } = req.body;

      const user = await UserModel.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3h",
      });
      res.cookie("access_token", token);
      res
        .status(200)
        .json({ message: "Login Successful", token, userID: user._id });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
      if (!authHeader) {
        return res.status(403).json({ message: "Not authorized" });
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
