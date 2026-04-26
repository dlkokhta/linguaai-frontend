import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getErrorMessage } from "../../types/errors";
import { RegistrationSuccess } from "../../components/RegistrationSuccess";
import { registrationSchema } from "../../schemas/index";
import type { registrationTypes } from "../../types/registrationTypes";
import { RegisterBrandingPanel } from "./components/RegisterBrandingPanel";
import { RegisterForm } from "./components/RegisterForm";

export const RegistrationPage = () => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(registrationSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: registrationTypes) => {
    const url = import.meta.env.VITE_API_URL;
    const userData = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
      passwordRepeat: data.repeatPassword,
    };

    try {
      setResponseError(null);
      await axios.post(`${url}/auth/signup`, userData);
      setResponseMessage("Registration successful!");
      reset();
    } catch (error) {
      setResponseError(getErrorMessage(error, "Registration failed. Please try again."));
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

      <RegisterBrandingPanel />

      <div className="w-full lg:w-3/5 flex flex-col px-6 sm:px-10 lg:px-16 xl:px-24 py-8 lg:py-10 overflow-y-auto">
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
          <RegisterForm
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            responseError={responseError}
          />
        </div>
      </div>
    </div>
  );
};
