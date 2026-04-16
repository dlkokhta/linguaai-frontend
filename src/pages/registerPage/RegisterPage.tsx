import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RegistrationSuccess } from "../../components/RegistrationSuccess.js";
import { registrationSchema } from "../../schemas/index.js";
import GoogleButton from "../../components/GoogleButton.js";
import type { registrationTypes } from "../../types/registrationTypes.js";
import { Mail, Lock, User, Sparkles, Target, Zap, Globe } from "lucide-react";

export const RegistrationPage = () => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const {
    register,

    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(registrationSchema) });

  const navigate = useNavigate();

  const onSubmit = async (data: registrationTypes) => {
    const url = import.meta.env.VITE_API_URL;
    console.log("Registration data:", data);
    const userData = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
      passwordRepeat: data.repeatPassword,
    };

    try {
      setResponseError(null);
      const response = await axios.post(`${url}/auth/signup`, userData);
      console.log("Registration response:", response.data);
      setResponseMessage("Registration successful!");
      reset();
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (Array.isArray(message)) {
        setResponseError(message[0]);
      } else if (typeof message === "string") {
        setResponseError(message);
      } else {
        setResponseError("Registration failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (showModal) navigate("/login");
  }, [showModal]);

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      {responseMessage && !showModal && (
        <RegistrationSuccess
          message="Registration successful! Please check your email to verify your account."
          onClose={() => setShowModal(true)}
        />
      )}

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full border border-white/10" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-white font-semibold text-xl">LinguaAI</span>
        </div>

        {/* Heading */}
        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-snug mb-10">
            Start your English<br />learning journey today.
          </h2>
          <ul className="space-y-5">
            {[
              { icon: <Sparkles size={18} />, text: "AI-powered sentence generation" },
              { icon: <Target size={18} />, text: "Personalised vocabulary builder" },
              { icon: <Zap size={18} />, text: "Instant feedback & progress tracking" },
              { icon: <Globe size={18} />, text: "Georgian ↔ English translations" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-white/50 text-xs relative z-10">© 2026 LinguaAI. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-3/5 flex flex-col px-6 sm:px-10 lg:px-16 xl:px-24 py-8 lg:py-10 overflow-y-auto">
        {/* Mobile logo — pinned to the top */}
        <div
          onClick={() => navigate("/")}
          className="flex lg:hidden items-center gap-2 mb-0 cursor-pointer"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">LinguaAI</span>
        </div>

        <div className="flex-1 flex flex-col justify-center mt-8 lg:mt-0">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">
            Join thousands of learners improving their English with AI.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName")}
                    name="firstName"
                    placeholder="First name"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 transition-colors ${
                      errors.firstName ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName")}
                    name="lastName"
                    placeholder="Last name"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 transition-colors ${
                      errors.lastName ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  name="email"
                  placeholder="you@example.com"
                  className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 transition-colors ${
                    errors.email ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                  }`}
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              ) : (
                responseError && <p className="text-xs text-red-500 mt-1">{responseError}</p>
              )}
            </div>

            {/* Password + Repeat Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    name="password"
                    placeholder="Create a password"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 transition-colors ${
                      errors.password ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Repeat Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="password"
                    id="repeatPassword"
                    {...register("repeatPassword")}
                    name="repeatPassword"
                    placeholder="Confirm password"
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder:text-gray-500 transition-colors ${
                      errors.repeatPassword ? "border-red-400" : "border-gray-200 dark:border-gray-700"
                    }`}
                  />
                </div>
                {errors.repeatPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.repeatPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm mt-1"
            >
              Create account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <GoogleButton />
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};
