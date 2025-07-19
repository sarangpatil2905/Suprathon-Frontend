import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Step 1
import Header from "@/components/Header";
import axios from "axios";

const LoginPage = () => {
    const [userType, setUserType] = useState<"student" | "tpo">("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Step 2

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Mock authentication logic
        if (email && password) {
            const result = await axios.post("http://localhost:8000/user/login", {
                email: email,
                password: password,
            })
            console.log(result)
        } else {
            alert("Please enter email and password.");
        }
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden flex flex-col items-center gap-10 px-4"
            style={{
                backgroundColor: "hsl(0, 0%, 98%)",
                backgroundImage:
                    "repeating-linear-gradient(to right, #e5e7eb 0px, #e5e7eb 1px, transparent 0px, transparent 140px)",
            }}
        >
            <Header />

            {/* Gradient backgrounds */}
            {/* ... keep your background spots here ... */}

            {/* Header Text */}
            <div className="text-center mb-6">
                <h2 className="text-sm font-semibold text-gray-500 tracking-widest uppercase">Members</h2>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#252525] mt-2">Welcome to your smart portal.</h1>
                <p className="text-gray-500 mt-2">Empowering Careers. Simplifying Placements.</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-8">
                {/* Toggle Buttons */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setUserType("student")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${userType === "tpo"
                            ? "bg-[#f3f3f3] text-[#252525]"
                            : "bg-[#252525] text-[#f3f3f3]"
                            }`}
                    >
                        Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType("tpo")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${userType === "tpo"
                            ? "bg-[#252525] text-[#f3f3f3]"
                            : "bg-[#f3f3f3] text-[#252525]"
                            }`}
                    >
                        TPO / Admin
                    </button>
                </div>

                <h3 className="text-center text-lg font-semibold text-[#252525] mb-6">
                    {userType === "student" ? "Student Login" : "TPO/Admin Login"}
                </h3>

                {/* Login Form */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(98,67%,68%)]"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(98,67%,68%)]"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-[hsl(98,67%,68%)] hover:bg-[hsl(98,67%,60%)] text-[#252525] font-medium py-3 rounded-lg transition duration-200"
                    >
                        {userType === "student" ? "Login as Student" : "Login as TPO/Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
