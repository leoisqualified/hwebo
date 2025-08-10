import { useForm } from "react-hook-form";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res.data.token;
      await login(token);

      setNotification({ message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      setNotification({
        message: error.response?.data?.error || "Login failed",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg   overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <img
                  src="/favicon/favicon-96x96.png"
                  alt="HyɛBɔ Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome to HyɛBɔ
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Sign in to your account
              </p>
            </div>

            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-3 rounded-md ${
                  notification.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {notification.type === "success" ? (
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  <button
                    onClick={() => setNotification(null)}
                    className="text-current hover:text-opacity-70"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] transition placeholder-gray-400 text-sm"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#059669] focus:border-[#059669] transition placeholder-gray-400 text-sm"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#059669] focus:ring-[#059669] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-xs text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-xs">
                  <a href="#" className="text-[#059669] hover:text-[#059669]">
                    Forgot password?
                  </a>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#059669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669] transition-colors hover:cursor-pointer hover:bg-[#047857]"
              >
                Sign in
              </motion.button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#059669]"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                <span className="ml-2">Twitter</span>
              </button>
            </div>

            <div className="text-center text-xs text-gray-500">
              Not registered yet?{" "}
              <a
                href="/register"
                className="text-[#059669] hover:text-[#059669] font-medium"
              >
                Create account
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
