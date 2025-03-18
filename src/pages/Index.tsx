
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth status and redirect accordingly
    if (user.isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Render loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      <div className="glass-card p-8 rounded-2xl shadow-xl text-center">
        <div className="animate-pulse-subtle">
          <div className="h-10 w-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-lg font-medium">Redirecting...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
