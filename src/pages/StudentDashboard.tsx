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
    TrendingUp
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { useEffect, useState } from "react";
import React from 'react';

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
}

interface StudentDashboardProps {
    userData: StudentData;
}

import { useUser } from "../context/UserContext";
import axios from "axios";

const StudentDashboard = () => {
    const { userData } = useUser();
    const [myApplications, setMyApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

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
            setUpcomingInterviews(response.data.interviews);
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        fetchMyApplications();
        fetchCompanies();
        fetchUpcomingInterviews();
    }, []);

    if (!userData) return <div>Loading...</div>;

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
                return 'bg-success/10 text-success border-success/20';
            case 'pending':
            case 'under_review':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'rejected':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted';
        }
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date('2025-07-19T20:57:00+05:30'); // Updated to current date and time: 08:57 PM IST
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7);
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
    }).slice(0, 28); // 4 weeks (28 days)

    const handlePreviousWeek = () => setCurrentWeekOffset(offset => Math.max(offset - 1, -1));
    const handleNextWeek = () => setCurrentWeekOffset(offset => Math.min(offset + 1, 2));

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
            <Navbar />
            <div className="p-6 space-y-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-primary bg-clip-text text-transparent text-black">
                                Student Dashboard
                            </h1>
                            <p className="text-muted-foreground">Track your placement journey and applications</p>
                        </div>
                    </div>
                </div>

                <Card className="bg-gradient-to-r from-card to-card/80 border-0 shadow-[var(--shadow-card)]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{userData.firstName + " " + userData.lastName}</h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="secondary">4th Year</Badge>
                                    <span className="text-sm">CGPA: <span className="font-bold text-primary">{userData.cgpa}</span></span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Calendar Overview
                                </CardTitle>
                                <CardDescription>Your scheduled interview sessions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-4">
                                    <Button onClick={handlePreviousWeek} disabled={currentWeekOffset === -1}>Previous</Button>
                                    <span>Week {currentWeekOffset + 1} of 4</span>
                                    <Button onClick={handleNextWeek} disabled={currentWeekOffset === 2}>Next</Button>
                                </div>
                                <div className="grid grid-cols-[repeat(7,1fr)] gap-2 text-center">
                                    {days.map(day => (
                                        <div key={day} className="font-semibold text-muted-foreground">
                                            {day.slice(0, 3)}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-[repeat(7,1fr)] gap-2 mt-2">
                                    {weekDays.slice(currentWeekOffset * 7, (currentWeekOffset + 1) * 7).map((day, index) => (
                                        <div key={index} className={`border rounded-lg p-2 h-24 overflow-y-auto ${day.isPast ? 'bg-gray-200' : 'bg-card'}`}>
                                            <div className="text-sm font-medium">{day.date} {day.month}</div>
                                            {day.interviews.map((interview, i) => (
                                                <div key={i} className={`p-1 mt-1 text-xs rounded ${getStatusColor(interview.status)}`}>
                                                    {interview.company}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Recent Applications
                                </CardTitle>
                                <CardDescription>Your latest job applications</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-0">
                                    {myApplications.map((application, index) => (
                                        <div
                                            key={index}
                                            className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-sm">{application.companyName}</h4>
                                                    <Badge className={getStatusColor(application.status)} variant="outline">
                                                        {application.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">{application.role}</p>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">{new Date(application.createdAt).toISOString()}</span>
                                                    </div>
                                                </div>
                                            </div>
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