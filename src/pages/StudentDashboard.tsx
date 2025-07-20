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
import { BASE_URL } from "@/assets/constants";

interface StudentData {
    name: string;
    rollNumber: string;
    branch: string;
    year: string;
    cgpa: number;
}

interface Application {
    _id: string;
    companyName: string;
    role?: string;
    status: string;
    createdAt: string;
    userCgpa: number;
    companyId: string;
    companyYear: number;
    companyEligibilityCgpa: number;
    companyPackage: { componentName: string; amount: number }[];
    companySchedule: { eventName: string; date: string; description: string; _id: string }[];
}

interface Interview {
    company: string;
    role: string;
    date: string;
    time?: string;
    type?: string;
    status: string;
    round?: string;
}

const StudentDashboard = () => {
    const { userData } = useUser();
    const navigate = useNavigate();
    const [myApplications, setMyApplications] = useState<Application[]>([]);
    const [companies, setCompanies] = useState([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [skills, setSkills] = useState([]);
    const maxOffset = 4; // 4 weeks before and after current week

    useEffect(() => {
        // Redirect based on user type on mount or userData change
        if (userData) {
            if (userData.userType === "student") {
                // Stay on /dashboard (no redirect needed if already here)
            } else {
                navigate("/admin"); // Redirect to admin for non-student roles (e.g., tpo)
            }
        }
    }, [userData, navigate]);

    const fetchMySkills = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/getUserSkills`, { withCredentials: true });
            setSkills(response.data.data.technicalSkills);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchMyApplications = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/application/getAllApplicationsByUser`, { withCredentials: true });
            setMyApplications(response.data.applications || []);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/company/getAllCompanies`, { withCredentials: true });
            setCompanies(response.data.data.companies);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchMyApplications();
        fetchCompanies();
        fetchMySkills();
        console.log(myApplications);
    }, []);

    if (!userData) return <div className="bg-transparent text-[#252525]">Loading...</div>;

    // Only render student dashboard if user is a student
    if (userData.userType !== "student") return null; // Avoid rendering for non-students

    const applicationStats = {
        totalApplications: myApplications.length,
        pendingApplications: myApplications.filter(app => app.status === "pending" || app.status === "under_review").length,
        interviewsScheduled: myApplications.filter(app => app.status === "shortlisted" || app.status === "confirmed").length,
        offersReceived: myApplications.filter(app => app.status === "accepted").length
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
    const today = new Date('2025-07-20T01:47:00+05:30'); // Current date and time: 01:47 AM IST
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);
    const weekDays = Array.from({ length: 28 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const interviews = myApplications
            .filter(app => app.status === "accepted") // Only include accepted applications
            .flatMap(app =>
                app.companySchedule.map(schedule => ({
                    company: app.companyName,
                    role: app.role || "N/A",
                    date: schedule.date.split('T')[0],
                    time: schedule.date.split('T')[1].split('.')[0], // Extract time (e.g., "10:00:00")
                    type: schedule.eventName, // Use eventName as type
                    status: app.status,
                    round: schedule.eventName // Map eventName to round
                }))
            )
            .filter(interview => {
                const interviewDate = new Date(interview.date + 'T' + interview.time);
                return interviewDate.toDateString() === date.toDateString();
            });
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }),
            fullDate: date.toISOString().split('T')[0],
            isPast: date < today,
            hasEvents: interviews.length > 0, // Flag for days with events
            interviews
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
                                            {(skills || ["React", "Node.js", "DSA", "SQL", "Mongo"]).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="w-19 inline-block bg-[#9FE477]/40 text-[#252525] text-sm font-medium px-3 py-1 rounded-full "
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
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
                                            className={`border p-2 h-24 overflow-y-auto ${day.isPast ? 'bg-[#f5f5f5]' : 'bg-transparent'} ${day.hasEvents ? 'bg-[#e6f3e1]' : ''}`}
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