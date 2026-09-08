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
      setError(err.response?.data?.message || "فشل تسجيل الدخول، يُرجى التأكد من البيانات المدخلة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 bg-slate-50 flex flex-col justify-center 
       items-center" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-xl rounded-3xl p-6 sm:p-8 border border-slate-100 backdrop-blur-xl"
      >
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center mb-6 text-center">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-3 shadow-inner">
            <LuNotebookPen className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">دفتر الملاحظات</h1>
          <p className="text-sm text-slate-500 mt-1">مكانك الهادئ لتدوين الأفكار والملاحظات</p>
        </div>

        <div className="border-b border-slate-100 w-full mb-6"></div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-medium text-sm">البريد الإلكتروني</label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="moaaz@gmail.com"
                className="w-full bg-slate-50 rounded-xl py-3 pr-10 pl-4 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 transition-all text-sm"
              />
              <MdOutlineEmail className="absolute right-3 text-slate-400 text-lg pointer-events-none" />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 font-medium text-sm">كلمة المرور</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 rounded-xl py-3 pr-10 pl-10 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 transition-all text-sm"
              />
              <FiLock className="absolute right-3 text-slate-400 text-lg pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 text-slate-400 hover:text-slate-600 text-lg transition-colors cursor-pointer"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full mt-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              type="submit"
              className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl px-4 py-3 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </motion.button>
          </div>
        </form>

        {/* Link to Register */}
        <div className="flex justify-center items-center mt-6 text-sm text-slate-600">
          <span>ليس لديك حساب؟ </span>
          <Link to="/register" className="text-blue-600 hover:underline font-semibold mr-1">
            إنشاء حساب جديد
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-xs">
          جميع الحقوق محفوظة &copy; NotPad 2026
        </div>
      </motion.div>
    </div>
  );
};

export default Login;