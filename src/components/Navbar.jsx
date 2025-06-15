import { Link, Navigate, NavLink } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";

function Navbar() {
  async function handleLogout() {
    let { error } = await supabase.auth.signOut().then(() => {
      window.location.href = "/";
    });
    if (error) {
      toast.error("Logout error:", error.message);
    }
  }
  return (
    <nav className="flex items-center justify-between p-4 px-12 shadow-sm bg-white">
      <Link to="/" className="text-xl font-bold hover:text-blue-600 transition">
        SkillShareBoard
      </Link>
      <ul className="flex space-x-8">
        <li>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              ` hover:text-blue-500 ${
                isActive ? "font-bold text-blue-600" : ""
              }`
            }
          >
            Explore
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              ` hover:text-blue-500 ${
                isActive ? "font-bold text-blue-600" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>{" "}
        <li>
          <button
            onClick={handleLogout}
            className="hover:text-blue-500 cursor-pointer text-center"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
