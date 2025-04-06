import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Header() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex justify-between mx-2  px-3 flex-col md:flex-row items-center text-center text-slate-300">
      <h1 className="text-[30px]  md:text-[50px] font-bold bg-gradient-to-r from-slate-900 to-slate-700 inline-block text-transparent  bg-clip-text">
        Todo App
      </h1>
      {!cookies.access_token ? (
        <div className="mt-2">
          <button className="bg-slate-800 px-5 p-2 md:p-2 mx-2 rounded-md md:rounded-sm  hover:bg-slate-950 hover:text-slate-300">
            <Link to="/login">LogIn</Link>
          </button>

          <button className="bg-slate-800  px-5 p-2 md:p-2 rounded-md md:rounded-sm  hover:bg-slate-950 hover:text-slate-300">
            <Link to="/signup">SignUp</Link>
          </button>
        </div>
      ) : (
        <div className="mt-2">
          <button
            onClick={logout}
            className="bg-slate-800  px-5 p-2 md:p-2 rounded-md md:rounded-sm  hover:bg-slate-950 hover:text-slate-300"
          >
            Logout{" "}
          </button>
        </div>
      )}
    </div>
  );
}
