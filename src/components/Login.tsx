import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, ChefHat } from "lucide-react";

// Use Unsplash image for food/recipe background
const bgUrl =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80";

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "kinyeramo@gmail.com",
    password: "password",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic credential check
    if (
      credentials.email === "kinyeramo@gmail.com" &&
      credentials.password === "password"
    ) {
      setErrorMsg("");
      onLogin({
        id: 1,
        name: "Kinyera Amos",
        email: credentials.email,
      });
    } else {
      setErrorMsg("Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-yellow-100 to-pink-100"
      style={{ minHeight: "100vh" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden bg-white/90">
        {/* Left: Food Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgUrl})` }}
        >
          <div className="h-full w-full min-h-[400px] bg-gradient-to-br from-pink-200/60 to-orange-100/40" />
        </div>
        {/* Right: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-gradient-to-br from-orange-100 via-pink-50 to-yellow-50">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-pink-200 via-orange-200 to-yellow-100 rounded-full p-4 shadow-md mb-2">
              <ChefHat className="h-14 w-14 text-pink-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-pink-700 mb-1 tracking-tight drop-shadow">
              Welcome Back
            </h1>
            <p className="text-pink-500 text-lg">
              Sign in to{" "}
              <span className="font-semibold text-orange-500">RecipeFlow</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center mb-2">
                <span className="text-red-600 text-sm font-medium">
                  {errorMsg}
                </span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-pink-300 absolute left-3 top-3.5" />
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all bg-white/80 shadow-sm text-pink-700 placeholder-pink-300"
                  placeholder="Enter your email"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-pink-300 absolute left-3 top-3.5" />
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all bg-white/80 shadow-sm text-pink-700 placeholder-pink-300"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-300 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-pink-500 hover:to-yellow-400 focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all duration-200"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 p-4 bg-pink-50/80 rounded-xl w-full text-center">
            <p className="text-sm text-pink-500">
              Credentials are pre-filled. Just click{" "}
              <span className="font-semibold">Sign In</span> to continue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
