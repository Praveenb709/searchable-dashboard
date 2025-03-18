
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Lock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user.isAuthenticated) {
      navigate("/");
    }
    setMounted(true);
  }, [user, navigate]);

  // Animation delay for the form entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-1/4 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 w-96 h-96 bg-indigo-400/20 rounded-full filter blur-3xl" />
      </div>
      
      <div 
        className={cn(
          "w-full max-w-md glass-card p-8 rounded-2xl shadow-xl relative z-10 transition-all duration-500",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="glass-input pl-10"
                required
                autoFocus
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass-input pl-10"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>Demo credentials: Username: <strong>Admin</strong>, Password: <strong>Project@123</strong></p>
          </div>
        </form>
      </div>
      
      <p className="text-sm text-center text-muted-foreground mt-8">
        &copy; {new Date().getFullYear()} Search Dashboard. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
