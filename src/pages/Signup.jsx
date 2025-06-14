import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/supabaseApi";
import toast from "react-hot-toast";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    console.log("Ready to submit: ", email, password);
    setLoading(true);
    signUp({ email, password })
      .then((data) => {
        toast.success("Signup successful!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        toast.error(error.message || "An error occurred during signup");
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-8  ">
      <h1 className="text-xl font-semibold">Signup to Skill Share Board</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-8 rounded shadow-md w-sm"
      >
        <label htmlFor="email">Email</label>
        <input
          className="outline-none rounded bg-gray-200 p-2"
          type="email"
          required
          value={email}
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="relative">
          <input
            className="w-full outline-none rounded bg-gray-200 p-2"
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            className="absolute right-2 top-2 text-xs"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            type="button"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading} className="btn" type="submit">
          {loading ? <ClipLoader color="#ffffff" /> : "Sign Up"}
        </button>

        <Link to={"/login"} className="text-blue-500 hover:underline">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}

export default Signup;
