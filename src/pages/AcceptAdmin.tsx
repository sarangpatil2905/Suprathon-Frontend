import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Check, X, Loader2, Search, Mail, GraduationCap } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
            console.log("Selected Students:", newSet); // Log new state
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

    console.log(filteredStudents)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Manage Students - {filteredStudents.length > 0 ? filteredStudents[0].company.name : "Loading..."}
                        </h1>
                        <p className="text-slate-600 mt-1">Review and manage student applications</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 h-11 bg-white shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>

                {/* Error or Loading Message */}
                {(error || loading) && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
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
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {message.isError ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                {/* Students List */}
                <div className="space-y-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student.user.id}
                            className={`flex items-center justify-between p-4 bg-white shadow-md rounded-lg transition-all duration-300 ${student.status === 'accepted'
                                ? 'bg-green-50'
                                : student.status === 'rejected'
                                    ? 'bg-red-50 opacity-75'
                                    : 'hover:bg-blue-50/50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student.user.id)}
                                    onChange={() => handleSelect(student.user.id)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={student.status !== "applied"}
                                />
                                <div>
                                    <p className="font-medium text-slate-800">{student.user.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="w-4 h-4" />
                                        <span>{student.user.email}</span>
                                        <GraduationCap className="w-4 h-4 text-blue-600" />
                                        <span>CGPA: {student.user.cgpa}</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-slate-600">
                                Status: {student.status}
                            </span>
                        </div>
                    ))}
                    {filteredStudents.length === 0 && !loading && (
                        <p className="text-center text-slate-500">
                            No students found matching your search.
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                        <Check className="w-4 h-4 mr-2" /> Accept Selected Students
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AcceptAdmin;