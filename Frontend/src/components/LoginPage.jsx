import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Sun, Moon } from "lucide-react";

export default function LoginPage() {
  const [dark, setDark] = useState(false);
  const [name, setName] = useState(""); // New state for name input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      if (!email && !password && !name) {
        setMessage("Name, email, and password are required");
      } else if (!email && !password) {
        setMessage("Email and password are required");
      } else if (!email && !name) {
        setMessage("Name and email are required");
      } else if (!password && !name) {
        setMessage("Name and password are required");
      } else if (!email) {
        setMessage("Email is required");
      } else if (!password) {
        setMessage("Password is required");
      } else if (!name) {
        setMessage("Name is required");
      }
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      });
      const userData = {
        email: email,
        name: name,
      };
      localStorage.setItem("token", JSON.stringify(userData));
      navigate("/Home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 flex items-center justify-center px-4">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full border dark:border-zinc-700 border-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {dark ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-zinc-800" />
            )}
          </button>
        </div>
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-4">Get Started</h2>
              <p className="text-zinc-200 mb-6">
                Welcome to ContestVerse, your all-in-one competitive programming
                dashboard.
              </p>
            </div>
            <p className="text-sm text-zinc-100">
              New here? Create an account to continue.
            </p>
          </div>
          <div className="p-10 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white">
            <h2 className="text-3xl font-semibold mb-6">Login</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition duration-300"
              >
                Sign In
              </button>
            </form>
            {message && (
              <p className="text-sm mt-4 text-center text-red-600 dark:text-red-400">
                {message}
              </p>
            )}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 text-center">
              Don’t have an account?{" "}
              <a href="/register" className="text-indigo-500 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
