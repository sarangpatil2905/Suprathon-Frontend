import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
    User,
    FileText,
    Calendar,
    Target,
    Award,
    Building2,
    Download,
    Upload,
    BookOpen,
    TrendingUp,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useEffect, useState } from "react";
import React from 'react';
import { useUser } from "../context/UserContext";
import axios from "axios";

interface StudentData {
    name: string;
    rollNumber: string;
    branch: string;
    year: string;
    cgpa: number;
}

interface Interview {
    company: string;
    role: string;
    date: string;
    time: string;
    type: string;
    status: string;
    round: string;
}

interface StudentDashboardProps {
    userData: StudentData;
}

const StudentDashboard = () => {
    const { userData } = useUser();
    const [myApplications, setMyApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const maxOffset = 4; // 4 weeks before and after current week

    // Temporary mock data with rounds
    const tempInterviews: Interview[] = [
        { company: "Google", role: "SDE", date: "2025-07-20", time: "10:00", type: "Technical", status: "confirmed", round: "OA" },
        { company: "Microsoft", role: "PM", date: "2025-07-22", time: "14:00", type: "HR", status: "pending", round: "DSA" },
        { company: "Amazon", role: "SDE-1", date: "2025-07-25", time: "09:00", type: "Technical", status: "shortlisted", round: "Technical" },
        { company: "Facebook", role: "Intern", date: "2025-07-28", time: "15:00", type: "Interview", status: "under_review", round: "HR" },
        { company: "Tesla", role: "Engineer", date: "2025-08-01", time: "11:00", type: "Technical", status: "confirmed", round: "DSA" },
    ];

    const fetchMyApplications = async () => {
        try {
            const response = await axios.get('http://localhost:8000/application/getAllApplicationsByUser', { withCredentials: true });
            setMyApplications(response.data.applications);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:8000/company/getAllCompanies', { withCredentials: true });
            setCompanies(response.data.data.companies);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchUpcomingInterviews = async () => {
        try {
            const response = await axios.get('http://localhost:8000/interviews/getUpcomingInterviews', { withCredentials: true });
            setUpcomingInterviews(response.data.interviews || tempInterviews); // Use temp data if API fails
        } catch (err) {
            console.log(err.message);
            setUpcomingInterviews(tempInterviews); // Fallback to temp data
        }
    };

    useEffect(() => {
        fetchMyApplications();
        fetchCompanies();
        fetchUpcomingInterviews();
    }, []);

    if (!userData) return <div className="bg-transparent text-[#252525]">Loading...</div>;

    const applicationStats = {
        totalApplications: 12,
        pendingApplications: 5,
        interviewsScheduled: 3,
        offersReceived: 2
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
            case 'shortlisted':
                return 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]';
            case 'pending':
            case 'under_review':
                return 'bg-[#fff8e1] text-[#f57f17] border-[#ffe0b2]';
            case 'rejected':
                return 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]';
            default:
                return 'bg-[#f5f5f5] text-[#616161] border-[#e0e0e0]';
        }
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date('2025-07-19T21:45:00+05:30'); // Current date and time: 09:45 PM IST
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const weekDays = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            fullDate: date.toISOString().split('T')[0],
            isPast: date < today,
            interviews: upcomingInterviews.filter(interview => {
                const interviewDate = new Date(`${interview.date}T${interview.time}`);
                return interviewDate.toDateString() === date.toDateString();
            })
        };
    });

    const handlePreviousWeek = () => setWeekOffset(offset => Math.max(offset - 1, -maxOffset));
    const handleNextWeek = () => setWeekOffset(offset => Math.min(offset + 1, maxOffset));

    const formatDateRange = () => {
        const startDate = new Date(startOfWeek);
        const endDate = new Date(startOfWeek);
        endDate.setDate(startOfWeek.getDate() + 27); // 28 days total
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    return (
        <div className="min-h-screen bg-transparent text-gray-200 relative overflow-hidden">
            {/* Background Blobs */}
            <div
                className="absolute w-72 h-72 opacity-50 blur-3xl rounded-full top-0 left-1/2 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 68%) 0%, transparent 70%)",
                }}
            />
            <div
                className="absolute w-64 h-64 opacity-50 blur-2xl rounded-full bottom-0 left-6 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 78%) 0%, transparent 80%)",
                }}
            />
            <div
                className="absolute w-64 h-64 opacity-50 blur-2xl rounded-full top-1/3 left-1/4 z-[-1]"
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
            <Navbar />
            <div className="p-6 space-y-6 bg-transparent">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-transparent">
                    <div className="lg:col-span-1 space-y-6 bg-transparent">
                        {/* Profile Card */}
                        <Card className="bg-[#FAFAFA] rounded-lg shadow-md">
                            <CardContent className="p-6 bg-transparent">
                                <div className="space-y-6 bg-transparent">
                                    {/* Profile Photo and Details Section */}
                                    <div className="flex items-start gap-6 bg-transparent">
                                        <div className="w-16 h-16 bg-[#9FE477]/20 rounded-full flex items-center justify-center">
                                            <User className="w-8 h-8 text-[#9FE477]" />
                                        </div>
                                        <div className="flex-1 space-y-2 bg-transparent">
                                            <div className="flex items-center justify-between bg-transparent">
                                                <h2 className="text-xl font-bold text-[#252525]">
                                                    {userData.firstName + " " + userData.lastName}
                                                </h2>
                                                <Badge variant="secondary" className="bg-gray-200 text-[#252525]">
                                                    4th Year
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-[#616161] bg-transparent">
                                                <p>
                                                    CGPA: <span className="font-bold text-[#9FE477]">{userData.cgpa}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium text-[#252525]">Branch:</span> {userData.branch || "Computer Science"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Skills Section */}
                                    <div className="bg-transparent">
                                        <div className="flex flex-wrap gap-2 bg-transparent">
                                            {(userData.skills || ["React", "Node.js", "DSA", "SQL", "Mongo"]).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="w-19 inline-block bg-[#9FE477]/40 text-[#252525] text-sm font-medium px-3 py-1 rounded-full "
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            <button
                                                className="w-20 inline-block bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                                                onClick={() => console.log("Add skill clicked")} // Replace with actual handler
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {/* Resume Update Button */}
                                    <div className="flex justify-center bg-transparent">
                                        <button
                                            className="w-full bg-[#252525] text-[#f3f3f3] text-sm font-medium px-4 py-2 rounded-full hover:bg-[#9FE477]/80 transition-colors"
                                            onClick={() => console.log("Update resume clicked")} // Replace with actual handler
                                        >
                                            Update Resume
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Recent Applications */}
                        <Card className="bg-[#FAFAFA] rounded-lg shadow-md overflow-y-scroll">
                            <CardHeader className="bg-transparent">
                                <CardTitle className="flex items-center gap-2 text-lg text-[#252525]">
                                    <FileText className="w-5 h-5 text-[#9FE477]" />
                                    Recent Applications
                                </CardTitle>
                                <CardDescription className="text-[#616161]">Your latest job applications</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 bg-transparent">
                                <div className="space-y-0 bg-transparent">
                                    {myApplications.map((application, index) => (
                                        <div
                                            key={index}
                                            className="p-4 hover:bg-[#f5f5f5] transition-colors cursor-pointer bg-transparent"
                                        >
                                            <div className="space-y-2 bg-transparent">
                                                <div className="flex items-center justify-between bg-transparent">
                                                    <h4 className="font-medium text-sm text-[#252525]">{application.companyName}</h4>
                                                    <Badge className={getStatusColor(application.status)} variant="outline">
                                                        {application.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 bg-transparent">
                                                    <p className="text-sm text-[#616161]">{application.role}</p>
                                                    <div className="flex items-center justify-between text-xs bg-transparent">
                                                        <span className="text-[#757575]">{new Date(application.createdAt).toISOString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 bg-transparent">
                        <Card className="bg-[#FAFAFA]/80 rounded-lg shadow-md">
                            <CardHeader className="bg-transparent">
                                <CardTitle className="flex items-center gap-2 text-[#252525]">
                                    <Calendar className="w-5 h-5 text-[#9FE477]" />
                                    Calendar Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="bg-transparent">
                                <div className="flex items-center justify-between mb-4 bg-transparent">
                                    <Button variant="ghost" size="icon" onClick={handlePreviousWeek} disabled={weekOffset === -maxOffset} className="text-[#9FE477] hover:bg-[#9FE477]/10">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium text-[#252525]">{formatDateRange()}</span>
                                    <Button variant="ghost" size="icon" onClick={handleNextWeek} disabled={weekOffset === maxOffset} className="text-[#9FE477] hover:bg-[#9FE477]/10">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-[repeat(7,1fr)] gap-0 text-center bg-transparent">
                                    {days.map(day => (
                                        <div key={day} className="font-semibold text-[#616161] bg-transparent">
                                            {day.slice(0, 3)}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-[repeat(7,1fr)] gap-0 mt-2 bg-transparent">
                                    {weekDays.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`border p-2 h-24 overflow-y-auto ${day.isPast ? 'bg-[#f5f5f5]' : 'bg-transparent'}`}
                                        >
                                            <div className="text-sm text-[#757575] font-medium bg-transparent">{day.date} {day.month}</div>
                                            {day.interviews.map((interview, i) => (
                                                <div key={i} className={`p-1 mt-1 text-xs rounded ${getStatusColor(interview.status)}`}>
                                                    {interview.company} ({interview.round})
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default StudentDashboard;