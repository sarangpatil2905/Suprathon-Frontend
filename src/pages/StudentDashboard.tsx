import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

interface StudentData {
    name: string;
    rollNumber: string;
    branch: string;
    year: string;
    cgpa: number;
}

interface StudentDashboardProps {
    userData: StudentData;
}

import { useUser } from "@/context/usercontext";

const StudentDashboard = () => {
    const { userData } = useUser();

    if (!userData) return <div>Loading...</div>;

    const applicationStats = {
        totalApplications: 12,
        pendingApplications: 5,
        interviewsScheduled: 3,
        offersReceived: 2
    };

    const upcomingInterviews = [
        {
            company: "Google",
            role: "Software Engineer",
            date: "Tomorrow, 2:00 PM",
            type: "Technical Round",
            status: "confirmed"
        },
        {
            company: "Microsoft",
            role: "Product Manager Intern",
            date: "Dec 28, 10:00 AM",
            type: "HR Round",
            status: "confirmed"
        },
        {
            company: "Amazon",
            role: "SDE-1",
            date: "Dec 30, 3:00 PM",
            type: "Technical Round",
            status: "pending"
        }
    ];

    const recentApplications = [
        {
            company: "Flipkart",
            role: "Full Stack Developer",
            appliedDate: "2 days ago",
            status: "under_review",
            package: "18 LPA"
        },
        {
            company: "Zomato",
            role: "Frontend Developer",
            appliedDate: "1 week ago",
            status: "shortlisted",
            package: "16 LPA"
        },
        {
            company: "Paytm",
            role: "Backend Developer",
            appliedDate: "1 week ago",
            status: "rejected",
            package: "15 LPA"
        }
    ];

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                                Student Dashboard
                            </h1>
                            <p className="text-muted-foreground">Track your placement journey and applications</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                                <Download className="w-4 h-4 mr-2" />
                                Download Resume
                            </Button>
                            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg">
                                <Upload className="w-4 h-4 mr-2" />
                                Update Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <Card className="bg-gradient-to-r from-card to-card/80 border-0 shadow-[var(--shadow-card)]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">{userData.name}</h2>
                                <p className="text-muted-foreground">{userData.rollNumber} • {userData.branch}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="secondary">{userData.year}</Badge>
                                    <span className="text-sm">CGPA: <span className="font-bold text-primary">{userData.cgpa}</span></span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Profile Completion</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress value={85} className="w-20 h-2" />
                                    <span className="text-sm font-medium">85%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Applications"
                        value={applicationStats.totalApplications.toString()}
                        icon={FileText}
                        trend="+2"
                        className="col-span-1"
                    />
                    <StatsCard
                        title="Pending Review"
                        value={applicationStats.pendingApplications.toString()}
                        icon={Calendar}
                        trend="-1"
                        className="col-span-1"
                    />
                    <StatsCard
                        title="Interviews Scheduled"
                        value={applicationStats.interviewsScheduled.toString()}
                        icon={Target}
                        trend="+1"
                        className="col-span-1"
                    />
                    <StatsCard
                        title="Offers Received"
                        value={applicationStats.offersReceived.toString()}
                        icon={Award}
                        trend="+1"
                        className="col-span-1"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upcoming Interviews */}
                    <div className="lg:col-span-2">
                        <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Upcoming Interviews
                                </CardTitle>
                                <CardDescription>Your scheduled interview sessions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {upcomingInterviews.map((interview, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                                                    <Building2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{interview.company}</h4>
                                                    <p className="text-sm text-muted-foreground">{interview.role}</p>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(interview.status)}>
                                                {interview.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">{interview.type}</span>
                                            <span className="font-medium">{interview.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Applications */}
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
                                    {recentApplications.map((application, index) => (
                                        <div
                                            key={index}
                                            className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${index !== recentApplications.length - 1 ? 'border-b border-border/50' : ''
                                                }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium text-sm">{application.company}</h4>
                                                    <Badge className={getStatusColor(application.status)} variant="outline">
                                                        {application.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">{application.role}</p>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">{application.appliedDate}</span>
                                                        <span className="font-medium text-success">{application.package}</span>
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

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-[var(--shadow-elegant)] transition-all cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h3 className="font-medium mb-2">Placement Preparation</h3>
                            <p className="text-sm text-muted-foreground mb-4">Access study materials and practice tests</p>
                            <Button variant="outline" size="sm">Browse Resources</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:shadow-[var(--shadow-elegant)] transition-all cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
                            <h3 className="font-medium mb-2">Skill Assessment</h3>
                            <p className="text-sm text-muted-foreground mb-4">Take tests to validate your skills</p>
                            <Button variant="outline" size="sm">Start Assessment</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-info/5 to-info/10 border-info/20 hover:shadow-[var(--shadow-elegant)] transition-all cursor-pointer">
                        <CardContent className="p-6 text-center">
                            <Building2 className="w-8 h-8 text-info mx-auto mb-3" />
                            <h3 className="font-medium mb-2">Company Database</h3>
                            <p className="text-sm text-muted-foreground mb-4">Explore opportunities and company profiles</p>
                            <Button variant="outline" size="sm">View Companies</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
