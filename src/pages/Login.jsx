import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../services/supabaseApi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    console.log("Ready to submit: ", email, password);
    setLoading(true);
    login({ email, password })
      .then((data) => {
        toast.success("Login successful!");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error("An error occurred during login");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-8  ">
      <h1 className="text-xl font-semibold">Login to Skill Share Board</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md w-sm"
      >
        <label htmlFor="email">Email</label>
        <input
          className="outline-none  rounded bg-gray-200 p-2"
          type="email"
          value={email}
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            className="w-full outline-none rounded bg-gray-200 p-2"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 text-xs"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button disabled={loading} className="btn" type="submit">
          {loading ? <ClipLoader color="#ffffff" /> : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
