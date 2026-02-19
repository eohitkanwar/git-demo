import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// axios instance
const api = axios.create({
  baseURL: API_URL,
});

// attach token automatically
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 RESTORE USER ON REFRESH (PERSIST LOGIN SESSION)
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const token = localStorage.getItem("token");

    if (userInfo && token) {
      setCurrentUser(JSON.parse(userInfo));
    } else {
      setCurrentUser(null);
    }

    setLoading(false);
  }, []);

  // LOGIN (Admin Only)
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Check if user is admin
      if (data.user && data.user.role !== 'admin') {
        throw new Error("Access denied. Admin privileges required.");
      }

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      throw err;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  // password helpers (unchanged)
  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      return { success: true, message: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.put(
        `/auth/reset-password/${token}`,
        { password }
      );
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
