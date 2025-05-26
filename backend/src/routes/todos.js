import express from "express";
import { TodosModel } from "../models/Todos.js";
import { verifyToken } from "./user.js";

const router = express.Router();

//Get All Todos
router.get("/", async (req, res) => {
  try {
    const id = req.headers.authorization;
    const todos = await TodosModel.find({ userID: id });

    res.status(201).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new Todo
router.post("/", verifyToken, async (req, res) => {
  const data = req.body;
  if (!data.userID) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!data) {
    return res.status(400).json({ message: "todo is required" });
  }
  try {
    const todos = await TodosModel.create({
      todo: data.todo,
      userID: data.userID,
    });
    res.status(201).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a Todo

router.delete("/:id", async (req, res) => {
  const { id: todoId } = req.params;
  try {
    const todo = await TodosModel.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    await TodosModel.deleteOne({ _id: todoId });
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// update a todo
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { todo } = req.body;

  try {
    const filter = { _id: id };
    const update = { todo };

    await TodosModel.findOneAndUpdate(filter, update);
    res.status(201).json("updated");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// completed todos
router.post("/completed/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  console.log({ completed });

  try {
    const filter = { _id: id };
    const update = { completed };

    await TodosModel.findOneAndUpdate(filter, update);
    res.status(201).json("completed");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
