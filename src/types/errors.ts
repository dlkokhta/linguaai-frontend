export interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

export const getErrorMessage = (err: unknown, fallback = "Something went wrong"): string => {
  const error = err as ApiError;
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) return message[0];
  return message ?? fallback;
};
