
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type User = {
  username: string;
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const defaultUser: User = {
  username: "",
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : defaultUser;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // For this example, we're using static credentials
    // In a real application, you would verify credentials against a backend
    if (username === "Admin" && password === "Project@123") {
      setUser({
        username,
        isAuthenticated: true,
      });
      
      toast.success("Login successful", {
        description: `Welcome back, ${username}!`,
      });
      
      return true;
    } else {
      toast.error("Login failed", {
        description: "Invalid username or password. Please try again.",
      });
      
      return false;
    }
  };

  const logout = () => {
    setUser(defaultUser);
    toast.info("You have been logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth protection HOC
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
