import { useNavigate } from "react-router-dom";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import GoogleButton from "../../../components/GoogleButton";
import type { registrationTypes } from "../../../types/registrationTypes";

interface Props {
  register: UseFormRegister<registrationTypes>;
  errors: FieldErrors<registrationTypes>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  responseError: string | null;
}

export const RegisterForm = ({ register, errors, onSubmit, responseError }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
        Create your account
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">
        Join thousands of learners improving their English with AI.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
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

        <button
          type="submit"
          className="cursor-pointer w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm mt-1"
        >
          Create account
        </button>

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
  );
};
