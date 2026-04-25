import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export interface UserProfile {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  role: "REGULAR" | "ADMIN";
  picture: string | null;
  method: string;
  createdAt: string;
  isTwoFactorEnabled: boolean;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoading: boolean;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  isLoading: true,
  profile: null,
  setProfile: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const tokenRef = useRef<string | null>(null);

  const setAccessToken = (token: string | null) => {
    tokenRef.current = token;
    setAccessTokenState(token);
    if (!token) setProfile(null);
  };

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const res = await axios.post(
              `${BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
            const newToken = res.data.accessToken;
            setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch {
            setAccessToken(null);
            window.location.href = "/login";
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    axios
      .post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then(async (res) => {
        const token = res.data.accessToken;
        setAccessToken(token);
        try {
          const profileRes = await axiosInstance.get<UserProfile>("/user/me");
          setProfile(profileRes.data);
        } catch {
          // profile fetch failed silently
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isLoading, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
