"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";


export default function LoginPage() {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();


  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !password) {
      setError("Both User ID and password are required.");
      return;
    }
     
    const res = await signIn("credentials", {
      redirect: false,
      userId,
      password,
      
    });
 

    if (res.ok) {
      try {
         
        
          if (session?.user?.role === "admin") router.replace("/admin/dashboard");
          else if (session?.user?.role === "employee") router.replace("/employee/dashboard");
          else if (session?.user?.role === "intern") router.replace("/intern/dashboard");
        
      } catch (err) {
        setError("login failed.");
      }
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-indigo-100 flex flex-col">
      {/* Top Bar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 shadow-sm bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2
                .9 2 2s-.9 2-2 2-2-.9-2-2
                .9-2 2-2zm0 14.2c-2.5 0-4.71-1.28-6-3.22
                .03-1.99 4-3.08 6-3.08s5.97 1.09
                6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-700 leading-none">
              Security Testing Lab
            </h1>
            <p className="text-sm text-gray-500">
              Electronics & Test Development Centre, Mohali
            </p>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex flex-col lg:flex-row flex-1 items-center justify-center px-4 py-12 lg:px-24 gap-12">
        {/* Left Illustration */}
        <div className="hidden lg:block lg:w-1/2">
          <Image
            priority={false}
            src="/loginimage.png"
            alt="Security Visual"
            width={500}
            height={500}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6">Login to your account</p>

          {error && (
            <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User ID */}
            <div className="relative">
              <input
                type="text"
                id="userId"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="peer w-full px-4 pt-4 pb-2 text-black text-sm border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition duration-200"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-4 pb-2 text-black text-sm border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-500 transition duration-200"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-3 text-gray-500 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-semibold text-sm"
            >
              Log in
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
