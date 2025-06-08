import axios from "axios";
import { createContext, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

TodoContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const TodosContext = createContext(null);

export default function TodoContextProvider(props) {
  const { children } = props;
  const [spinner, setSpinner] = useState(false);
  const [todoError, setTodoError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [editID, setEditID] = useState("");
  const [todos, setTodos] = useState([]);
  const [todoValue, setTodoValue] = useState();
  const [inputError, setInputError] = useState("");
  const [refreshTodos, setRefreshTodos] = useState(false);
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const handleGetTodos = async () => {
    if (!cookies.access_token) {
      navigate("/login");
    }
    try {
      setSpinner(true);
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos`,

        {
          headers: {
            authorization: localStorage.getItem("userID"),
          },
        }
      );
      const todos = result.data.map((item) => item);
      setSpinner(false);
      return todos;
    } catch (error) {
      toast.error("Failed to fetch todos. Please try again.", {
        id: "todoError",
      });
    }
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();

    setInputError("");
    if (!todoValue) {
      setInputError("Todo is required");
      return;
    }
    setSpinner(true);

    setInputError("");
    if (!cookies.access_token) {
      setInputError("You must have an account to add todos");
      return;
    }

    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos`,
        { todo: todoValue, userID },

        {
          headers: {
            "Content-Type": "application/json",
            authorization: cookies.access_token,
          },
        }
      );

      if (!result) {
        setInputError("something went wrong");
        return;
      }
      setSpinner(false);
      setTodoValue("");
      setInputError("");
      setRefreshTodos(true);
    } catch (error) {
      setInputError(error.response.data.message);
    }
  };

  const handleDelete = async (todoId) => {
    setSpinner(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/${todoId}`
      );

      setSpinner(false);
      setTodos(todos.filter((todo) => todo._id !== todoId));
      setTodoError("");
    } catch (err) {
      setTodoError("Failed to delete todo. Please try again.");
    }
  };

  const handleEdit = async () => {
    setInputValue("");
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/${editID}`,
        {
          todo: inputValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!inputValue) {
        setInputError("Please add a todo");
        return;
      }
      setInputError("");
      if (result.data === "updated") {
        setSpinner(true);
        setEditID("");
        setRefreshTodos(true);
      }
    } catch (error) {
      setTodoError("Failed to edit todo. Please try again.");
    }
  };

  const handleToggle = async (completeID, isCompleted) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/completed/${completeID}`,
        {
          completed: !isCompleted,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (result.data === "completed") {
        setRefreshTodos(true);
      }
    } catch (error) {
      setTodoError("Failed to toggle todos. Please try again.");
    }
  };

  return (
    <TodosContext.Provider
      value={{
        handleDelete,
        handleToggle,
        handleEdit,
        handleAddTodo,
        handleGetTodos,
        todos,
        setTodos,
        todoError,
        inputError,
        refreshTodos,
        setRefreshTodos,
        todoValue,
        setTodoValue,
        editID,
        setEditID,
        inputValue,
        setInputValue,
        spinner,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
