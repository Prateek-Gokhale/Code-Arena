import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("codearena_user") || "null"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("codearena_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(({ user: currentUser }) => {
        setUser(currentUser);
        localStorage.setItem("codearena_user", JSON.stringify(currentUser));
      })
      .catch(() => {
        localStorage.removeItem("codearena_token");
        localStorage.removeItem("codearena_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const data = await authService.login(payload);
        localStorage.setItem("codearena_token", data.token);
        localStorage.setItem("codearena_user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}`);
        return data.user;
      },
      async register(payload) {
        const data = await authService.register(payload);
        localStorage.setItem("codearena_token", data.token);
        localStorage.setItem("codearena_user", JSON.stringify(data.user));
        setUser(data.user);
        toast.success("Account created");
        return data.user;
      },
      logout() {
        localStorage.removeItem("codearena_token");
        localStorage.removeItem("codearena_user");
        setUser(null);
        toast.success("Logged out");
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
