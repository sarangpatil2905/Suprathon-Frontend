import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import axios from "axios";

const SignupForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        age: "",
        gender: "",
        cgpa: "",
    });

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null); // Clear error on input change
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("File size must be less than 5MB");
                setResumeFile(null);
            } else {
                setResumeFile(file);
                setError(null);
            }
        } else {
            setError("Please upload a PDF file only");
            setResumeFile(null);
        }
    };

    const validateStep1 = () => {
        const { firstName, lastName, phoneNumber, age, gender, cgpa } = formData;
        if (!firstName || !lastName || !phoneNumber || !age || !gender || !cgpa) {
            setError("All fields are required in Step 1");
            return false;
        }
        if (parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
            setError("CGPA must be between 0 and 10");
            return false;
        }
        if (parseInt(age) < 18 || parseInt(age) > 100) {
            setError("Age must be between 18 and 100");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const { email, password } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !password || !resumeFile) {
            setError("All fields are required in Step 2");
            return false;
        }
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            if (validateStep1()) {
                setStep(2);
            }
        } else {
            if (validateStep2()) {
                const formDataToSend = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    formDataToSend.append(key, value);
                });
                formDataToSend.append('userType', 'student');
                if (resumeFile) {
                    formDataToSend.append("resume", resumeFile);
                }

                try {
                    const response = await axios.post("http://localhost:8000/user/signup", formDataToSend, {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true,
                    });
                    console.log("Signup successful:", response.data);
                    navigate("/login");
                } catch (err: any) {
                    setError(err.response?.data?.message || "Signup failed. Please try again.");
                }
            }
        }
    };

    return (
        <div className="min-h-screen">
            <Header />
            <div className="flex">
                <div className="absolute w-72 h-72 bg-[radial-gradient(circle_at_center,_hsl(98,67%,68%)_0%,_transparent_70%)] opacity-50 blur-3xl rounded-full top-0 left-20 z-[-1]" />
                <div className="absolute w-64 h-64 bg-[radial-gradient(circle,_hsl(98,67%,78%)_0%,_transparent_80%)] opacity-50 blur-2xl rounded-full bottom-0 left-6 z-[-1]" />
                <div className="absolute w-52 h-52 bg-[radial-gradient(circle,_hsl(98,67%,73%)_0%,_transparent_80%)] opacity-50 blur-2xl rounded-full top-1/3 right-1/2 z-[-1]" />

                {/* Left Section - Illustration */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                    <div className="max-w-md text-center">
                        <h1 className="text-3xl font-bold text-foreground mb-4">
                            Get started with smart placement tracking
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            OCR-based resume parsing, and instant analytics.
                        </p>
                        <img
                            alt="Signup Illustration"
                            className="w-full max-w-sm mx-auto mb-8"
                            src="./illustration.png"
                        />
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
                    <Card className="w-full max-w-xl md:max-w-2xl p-6 md:p-8 flex flex-col justify-between">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Create Account
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    Step {step} of 2 — Fill in your details
                                </p>
                            </div>

                            {error && <p className="text-center text-red-500">{error}</p>}

                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Enter first name"
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    handleInputChange("firstName", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Enter last name"
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    handleInputChange("lastName", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="Enter phone number"
                                                value={formData.phoneNumber}
                                                onChange={(e) =>
                                                    handleInputChange("phoneNumber", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="Enter age"
                                                value={formData.age}
                                                onChange={(e) => handleInputChange("age", e.target.value)}
                                                required
                                                min="18"
                                                max="100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender *</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    handleInputChange("gender", value)
                                                }
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                    <SelectItem value="Rather Not Say">
                                                        Rather Not Say
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cgpa">CGPA *</Label>
                                            <Input
                                                id="cgpa"
                                                type="number"
                                                placeholder="Enter CGPA (e.g., 3.50)"
                                                value={formData.cgpa}
                                                onChange={(e) => handleInputChange("cgpa", e.target.value)}
                                                required
                                                min="0"
                                                max="10"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Step 2: Additional Info */}
                            {step === 2 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleInputChange("email", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={(e) =>
                                                    handleInputChange("password", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="resume">Resume Upload *</Label>
                                        <div className="relative">
                                            <Input
                                                id="resume"
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                required
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="resume"
                                                className="flex items-center justify-center w-full p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                            >
                                                <Upload className="w-5 h-5 mr-2 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">
                                                    {resumeFile ? resumeFile.name : "Upload PDF resume"}
                                                </span>
                                            </Label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Submit/Next Button */}
                            <Button type="submit" className="w-full">
                                {step === 1 ? "Next" : "Create Account"}
                            </Button>

                            {step === 2 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>
                            )}

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;