import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Check, X, Loader2, Search, Mail, GraduationCap } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";

interface Student {
    _id: string;
    user: {
        id: string;
        email: string;
        name: string;
        cgpa: number;
    };
    company: {
        id: string;
        name: string;
    };
    status: "applied" | "accepted" | "rejected";
    createdAt: Date;
}

const AcceptAdmin = () => {
    const { companyId } = useParams<{ companyId: string }>();
    console.log("Company ID:", companyId);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [message, setMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/application/getAllApplicationsByCompany/${companyId}`, {
                withCredentials: true,
            });
            setStudents(response.data.applications || []);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch students.");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [companyId]);

    const handleSelect = (studentId: string) => {
        setSelectedStudents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            console.log("Selected Students:", newSet);
            return newSet;
        });
    };

    const handleSubmit = async () => {
        if (selectedStudents.size === 0) {
            setMessage({ text: "Please select at least one student.", isError: true });
            setTimeout(() => setMessage({ text: "", isError: false }), 2000);
            return;
        }

        try {
            console.log("Submitting:", { acceptedStudents: Array.from(selectedStudents) });
            await axios.patch(
                `http://localhost:8000/application/accept/${companyId}`,
                { acceptedStudents: Array.from(selectedStudents) },
                { withCredentials: true }
            );
            setStudents(prev =>
                prev.map(student =>
                    selectedStudents.has(student._id) ? { ...student, status: "accepted" } : student
                )
            );
            setSelectedStudents(new Set());
            setMessage({ text: "Selected students accepted successfully!", isError: false });
            setTimeout(() => setMessage({ text: "", isError: false }), 2000);
            window.location.reload();
        } catch (err: any) {
            setMessage({ text: err.response?.data?.message || "Failed to update students.", isError: true });
            setTimeout(() => setMessage({ text: "", isError: false }), 2000);
        }
    };

    const filteredStudents = students.filter(student =>
        student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredStudents);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]';
            case 'applied':
                return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe0b2]';
            case 'rejected':
                return 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]';
            default:
                return 'bg-[#f5f5f5] text-[#616161] border-[#e0e0e0]';
        }
    };

    return (

        <div className="min-h-screen bg-transparent text-gray-200 relative overflow-hidden">
            {/* Background Blobs */}

            <div
                className="absolute w-72 h-72 opacity-30 blur-3xl rounded-full top-0 left-1/2 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 68%) 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute w-64 h-64 opacity-30 blur-2xl rounded-full bottom-0 left-6 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 78%) 0%, transparent 80%)",
                }}
            />
            <div
                className="absolute w-64 h-64 opacity-30 blur-2xl rounded-full top-1/3 left-1/4 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 73%) 0%, transparent 80%)",
                }}
            />
            <div
                className="absolute w-80 h-80 opacity-50 blur-3xl rounded-full bottom-1/4 right-20 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 70%) 0%, transparent 75%)",
                }}
            />
            <AdminNavbar />
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#252525]">
                            Manage Students - {filteredStudents.length > 0 ? filteredStudents[0].company.name : "Loading..."}
                        </h1>
                        <p className="text-[#616161] mt-1">Review and manage student applications</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 h-11 bg-[#FAFAFA] shadow-sm border-[#e0e0e0] focus:border-[#9FE477]"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9FE477]" />
                </div>

                {/* Error or Loading Message */}
                {(error || loading) && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${error ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]' : 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]'}`}>
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-[#9FE477]" />
                                Loading students...
                            </>
                        ) : (
                            error
                        )}
                    </div>
                )}

                {/* Message Feedback */}
                {message.text && (
                    <div className={`p-3 rounded-lg flex items-center gap-2 ${message.isError
                        ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]'
                        : 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]'
                        }`}>
                        {message.isError ? <X className="w-4 h-4 text-[#d32f2f]" /> : <Check className="w-4 h-4 text-[#2f7d32]" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                {/* Students List */}
                <div className="space-y-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.user.id}
                            className={`flex items-center justify-between p-4 bg-[#FAFAFA] shadow-md rounded-lg transition-all duration-300 ${getStatusColor(student.status)} hover:bg-[#f5f5f5]`}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student.user.id)}
                                    onChange={() => handleSelect(student.user.id)}
                                    className="w-5 h-5 text-[#9FE477] border-[#e0e0e0] rounded focus:ring-[#9FE477]"
                                    disabled={student.status !== "applied"}
                                />
                                <div>
                                    <p className="font-medium text-[#252525]">{student.user.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-[#616161]">
                                        <Mail className="w-4 h-4 text-[#9FE477]" />
                                        <span>{student.user.email}</span>
                                        <GraduationCap className="w-4 h-4 text-[#9FE477]" />
                                        <span>CGPA: {student.user.cgpa}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`text-sm font-medium ${getStatusColor(student.status).split(' ')[1]}`}>
                                Status: {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                        </div>
                    ))}
                    {filteredStudents.length === 0 && !loading && (
                        <p className="text-center text-[#757575]">
                            No students found matching your search.
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525] shadow-lg"
                    >
                        <Check className="w-4 h-4 mr-2 text-[#252525]" /> Accept Selected Students
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AcceptAdmin;