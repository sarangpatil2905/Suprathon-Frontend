import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import axios from "axios";
import { useUser } from "../context/UserContext"; // adjust path if needed

const LoginPage = () => {
    const [userType, setUserType] = useState<"student" | "tpo">("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUserData } = useUser(); // access context

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8000/user/login",
                {
                    email,
                    password,
                    type: userType,
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Login response:", res.data);

            if (res.status === 200 && res.data.user) {
                const user = res.data.user;

                setUserData(user);
                localStorage.setItem("userData", JSON.stringify(user));

                if (user.userType == 'student')
                    navigate("/dashboard");
                else
                    navigate('/admin');
            } else {
                alert("Invalid login response.");
            }
        } catch (err: any) {
            console.error("Login failed:", err?.response?.data || err.message);
            alert("Login failed: " + (err?.response?.data?.message || "Check your credentials"));
        }
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden flex flex-col items-center gap-10 px-4"
            style={{
                backgroundColor: "transparent",
                backgroundImage:
                    "repeating-linear-gradient(to right, #e5e7eb 0px, #e5e7eb 1px, transparent 0px, transparent 140px)",
            }}
        >

            <Header />
            <div
                className="fixed w-72 h-72 opacity-50 blur-3xl rounded-full top-0 left-1/2 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 68%) 0%, transparent 70%)",
                }}
            />
            <div
                className="fixed w-64 h-64 opacity-50 blur-2xl rounded-full bottom-0 left-6 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 78%) 0%, transparent 80%)",
                }}
            />
            <div
                className="fixed w-64 h-64 opacity-50 blur-2xl rounded-full top-1/3 left-1/4 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 73%) 0%, transparent 80%)",
                }}
            />
            <div
                className="fixed w-80 h-80 opacity-50 blur-3xl rounded-full bottom-1/4 right-20 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 70%) 0%, transparent 75%)",
                }}
            />
            {/* Header Text */}
            <div className="text-center mb-6">
                <h2 className="text-sm font-semibold text-gray-500 tracking-widest uppercase">Members</h2>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#252525] mt-2">Welcome to your smart portal.</h1>
                <p className="text-gray-500 mt-2">Empowering Careers. Simplifying Placements.</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-8">
                <h3 className="text-center text-lg font-semibold text-[#252525] mb-6">
                    Login
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
