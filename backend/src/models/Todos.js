import mongoose from "mongoose";

const todosSchema = mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export const TodosModel = mongoose.model("Todos", todosSchema);
