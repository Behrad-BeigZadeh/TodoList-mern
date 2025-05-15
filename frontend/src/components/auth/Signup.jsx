import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        username,
        password,
      });
      alert("Registration Completed! Now login.");

      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        setErrors(
          error.response.data.errors || [{ msg: error.response.data.message }]
        );
      } else {
        setErrors([{ msg: "Something went wrong..." }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center  mt-10  bg-slate-900 max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] mx-auto rounded-md  "
    >
      <h1 className="my-10 text-3xl md:text-5xl text-center text-slate-300">
        SignUp Form
      </h1>
      <div className=" flex flex-col sm:flex-row items-center justify-center text-center ">
        <label htmlFor="username" className="font-bold text-slate-300 sm:mx-1 ">
          Username :
        </label>
        <input
          value={username}
          name="username"
          type="username"
          placeholder="username"
          className=" rounded-md p-1 text-rose-900 w-[70%] my-4 bg-slate-300 "
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className=" flex flex-col sm:flex-row items-center justify-center">
        <label htmlFor="username" className="font-bold sm:mx-1 text-slate-300">
          Password :
        </label>
        <input
          value={password}
          name="password"
          type="password"
          placeholder="password"
          className=" rounded-md p-1  w-[70%] my-3 bg-slate-300 text-rose-900"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {errors.length > 0 && (
        <div className=" text-center  text-red-600 rounded-md p-4 mb-4 animate-pulse">
          {errors.map((error, index) => (
            <p key={index} className="text-sm">
              {error.msg}
            </p>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="mt-10 w-[100%] h-[35%] bg-slate-600 rounded-b-md text-[30px] p-1 font-bold text-slate-900 hover:bg-slate-950 hover:text-slate-300 "
      >
        {submitting ? "Submitting..." : " Sign Up"}
      </button>
      <p className="m-2 text-[13px] sm:text-[20px] text-center text-slate-500">
        Already a member ?{" "}
        <Link className="text-rose-900 font-bold p-1" to="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
