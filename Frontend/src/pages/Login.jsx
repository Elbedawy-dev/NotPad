import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuNotebookPen, LuEye, LuEyeOff } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock } from "react-icons/fi";

const Login = () => {
  const { Login: loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed, please check your credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6fb] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <LuNotebookPen className="text-white text-base" />
          </div>
          <span className="font-bold text-lg text-slate-900">Notes</span>
        </div>
        <span className="text-slate-400 text-sm">Secure Workspace</span>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm bg-white shadow-sm rounded-2xl p-6 sm:p-8 border border-slate-100">
          {/* Header Section */}
          <div className="flex flex-col justify-center items-center mb-6 text-center">
            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center mb-3">
              <LuNotebookPen className="text-white text-2xl" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-sm text-slate-400 mt-1">Log in to access your notes</p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl 
              text-sm text-center font-medium">
              {error}
            </motion.div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-medium text-sm">Email</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.j@minimal.io"
                  className="w-full bg-slate-50 rounded-lg py-2.5 pl-10 pr-4 outline-none border border-slate-200 focus:border-black focus:bg-white text-slate-800 transition-all text-sm"
                />
                <MdOutlineEmail className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-700 font-medium text-sm">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 rounded-lg py-2.5 pl-10 pr-10 outline-none border border-slate-200 focus:border-black focus:bg-white text-slate-800 transition-all text-sm"
                />
                <FiLock className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 text-lg transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full mt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                type="submit"
                className="cursor-pointer w-full bg-black hover:bg-slate-800 text-white font-semibold rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
              >
                {submitting ? "Logging in..." : "Log In"}
              </motion.button>
            </div>
          </form>

          {/* Link to Register */}
          <div className="flex justify-center items-center mt-6 text-sm text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-black hover:underline font-semibold ml-1">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;