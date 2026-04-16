import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { loginTypes } from "../../types/loginTypes";
import { loginSchema } from "../../schemas";
import { Mail, Lock, Sparkles, Volume2, Languages, BookOpen } from "lucide-react";
import GoogleButton from "../../components/GoogleButton";

export const LoginPage = () => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const url = import.meta.env.VITE_API_URL;

  const onSubmit = async (data: loginTypes) => {
    const userData = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await axios.post(`${url}/auth/login`, userData, {
        withCredentials: true,
      });

      // 2FA is enabled — redirect to verification page
      if (response.data.requiresTwoFactor) {
        navigate("/auth/2fa-verify", { state: { tempToken: response.data.tempToken } });
        return;
      }

      const accessToken = response.data.accessToken;
      setAccessToken(accessToken);

      if (response.data.user.role === "ADMIN") {
        navigate("/adminPanel");
      } else {
        navigate("/profile");
      }

      reset();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setResponseError(error.response.data.message);
      } else {
        setResponseError("An error occurred. Please try again.");
      }
    }
  };

  const handleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute bottom-20 -right-10 w-52 h-52 rounded-full border border-white/10" />

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">LinguaAI</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-snug mb-4">
            Your AI English
            <br />
            learning companion.
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed mb-8 max-w-xs">
            Generate sentences, build vocabulary, listen to native pronunciation and get Georgian translations — all powered by AI.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: Sparkles, label: "AI sentence generation" },
              { icon: BookOpen, label: "Vocabulary builder" },
              { icon: Volume2, label: "Text-to-speech" },
              { icon: Languages, label: "Georgian translation" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-white" />
                </div>
                <span className="text-white/90 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-emerald-200/70 text-xs">
          © {new Date().getFullYear()} LinguaAI. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-10 lg:px-16 py-8 lg:py-12">

        {/* Mobile logo — pinned to the top */}
        <div className="flex lg:hidden items-center gap-2 mb-0 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">L</span>
          </div>
          <span className="font-bold text-lg text-gray-800 dark:text-white">LinguaAI</span>
        </div>

        <div className="flex-1 flex flex-col justify-center mt-8 lg:mt-0">
        <div className="max-w-sm w-full mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Sign in to continue your English journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all ${
                    errors.email ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                  }`}
                  type="email"
                  id="email"
                  {...register("email")}
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              {!errors.email && responseError && <p className="text-xs text-red-500 mt-1">{responseError}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/passwordRecovery")}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 transition-all ${
                    errors.password ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                  }`}
                  type="password"
                  id="password"
                  {...register("password")}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-100 dark:shadow-none mt-1"
            >
              Sign in
            </button>

            <div className="relative flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <GoogleButton />
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <button
              onClick={() => handleClick("/register")}
              className="cursor-pointer text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Create one free
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window {
    google?: any;
  }
}
