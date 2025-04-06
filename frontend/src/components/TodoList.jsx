import { useEffect } from "react";
import { useTodosContext } from "../hooks/useTodosContext";
import { CustomInput } from "./CustomInput";

export default function TodoList() {
  const {
    handleDelete,
    handleEdit,
    handleAddTodo,
    handleGetTodos,
    handleToggle,
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
  } = useTodosContext();

  const todosFunction = async () => {
    try {
      const todos = await handleGetTodos();
      setTodos(todos);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    todosFunction();
    setRefreshTodos(false);
  }, [refreshTodos]);

  return (
    <div className="md:font-bold">
      <form
        className="md:max-w-[50%] max-w-[80%] md:mx-auto  mt-5 flex justify-center mx-auto"
        onSubmit={handleAddTodo}
      >
        <CustomInput
          Change={(e) => {
            setTodoValue(e.target.value);
          }}
          value={todoValue}
          buttonClick={() => {
            if (inputError || !todoValue) {
              console.log(inputError);
              return;
            }
          }}
          buttonValue="ADD"
          Holder="Add a todo ..."
        />
      </form>
      <div>
        {inputError && (
          <p className="text-red-600 text-center font-semibold">{inputError}</p>
        )}
      </div>
      {spinner ? (
        <div className="text-center mt-5">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-[60px] h-[60px] text-gray-200 animate-spin dark:text-gray-600 fill-slate-950"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col text-center mt-6">
          {todos?.length > 0 &&
            todos.map((todo, todoIndex) => {
              return (
                <li
                  className="flex 
                    justify-between py-2 text-slate-800  border-b px-2 border-b-slate-600 cursor-pointer"
                  key={todoIndex}
                >
                  {editID !== "" && editID === todo._id ? (
                    <div className="flex max-w-[80%]">
                      {" "}
                      <CustomInput
                        value={inputValue}
                        Holder="Type something ..."
                        Change={(e) => setInputValue(e.target.value)}
                        buttonValue="Edit"
                        buttonClick={() => handleEdit()}
                      />
                    </div>
                  ) : (
                    <span
                      onClick={() => handleToggle(todo._id, todo.completed)}
                      className={
                        todo.completed && "line-through text-stone-800"
                      }
                    >
                      {todo.todo}
                    </span>
                  )}

                  {editID === todo._id ? (
                    ""
                  ) : (
                    <div>
                      <button
                        onClick={() => setEditID(todo._id)}
                        className={todo.completed && "hidden"}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(todo._id);
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          <div>
            {todoError ? (
              <p className="text-red-600 text-center font-semibold">
                {todoError}
              </p>
            ) : (
              ""
            )}
          </div>
        </ul>
      )}
    </div>
  );
}
