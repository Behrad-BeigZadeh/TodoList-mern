import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./src/routes/user.js";
import { todosRouter } from "./src/routes/todos.js";
import { connectDb } from "./src/config/db.js";

const app = express();
const PORT = 5000 || process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", userRouter);
app.use("/api/todos", todosRouter);

app.listen(PORT, () => {
  connectDb();
  console.log(`server is running on PORT ${PORT}`);
});
