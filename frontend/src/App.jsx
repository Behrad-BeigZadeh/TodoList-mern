import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import Home from "./components/Home";
import TodoContextProvider from "./context/todoContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <TodoContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Toaster />
      </TodoContextProvider>
    </div>
  );
}

export default App;
