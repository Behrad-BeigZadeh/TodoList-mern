import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.js";
import todosRouter from "./src/routes/todos.js";
import { connectDb } from "./src/config/db.js";
import dotenv from "dotenv";
import logger from "./src/lib/logger.js";
dotenv.config();

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
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.use("/api/auth", userRouter);
app.use("/api/todos", todosRouter);

app.listen(PORT, () => {
  connectDb();
  logger.info(`Server is running on PORT ${PORT}`);
});
