import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [dark, setDark] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    if (!name || !email || !password) {
        setMessage('Fill all Feild to Register');
        alert('Fill all Feild to Register');
        return;
      }
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/users/register', {
        name,
        email,
        password
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 flex items-center justify-center px-4">
        {/* ... dark mode toggle ... */}
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-zinc-100 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-10 bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex flex-col justify-between">
            {/* ... content ... */}
          </div>
          <div className="p-10 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white">
            <h2 className="text-3xl font-semibold mb-6">Register</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 border rounded-xl ..."
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-xl ..."
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl ..."
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Create Account
              </button>
            </form>
            {message && (
              <p className="text-sm mt-4 text-center text-green-600 dark:text-green-400">
                {message}
              </p>
            )}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 text-center">
              Already registered? <a href="/" className="text-indigo-500 hover:underline">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
