import { useContext } from "react";
import { TodosContext } from "../context/todoContext";

export function useTodosContext() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("Forgot to add provider");
  }
  return context;
}
