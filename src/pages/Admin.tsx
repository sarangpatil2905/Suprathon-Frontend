import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import AdminNavbar from "@/components/AdminNavbar";
import axios from "axios";
import {
    User,
    Building2,
    FileText,
    Award,
    TrendingUp,
    DollarSign,
    IndianRupee
} from "lucide-react";

interface PackageComponent {
    total: number;
    average: string;
    highest: number;
    lowest: number;
    count: number;
}

interface TopCompany {
    companyId: string;
    name: string;
    count: number;
}

interface TopCTCOffer {
    _id: string;
    studentName?: string;
    companyName: string;
    totalCTC: number;
    package: { componentName: string; amount: number; _id: string }[];
}

interface PlacementStats {
    totalStudents: number;
    totalPlacements: number;
    totalStudentsPlaced: number;
    totalCompanies: number;
    placementPercentage: string;
    averageCTC: string;
    highestCTC: number;
    lowestCTC: number;
    packageComponents: Record<string, PackageComponent>;
    placementsByYear: Record<string, number>;
    topCompanies: TopCompany[];
    topCTCOffers: TopCTCOffer[];
}

interface UserData {
    firstName: string;
    lastName: string;
    userType: string;
}

const Admin: React.FC = () => {
    const { userData } = useUser();
    const [stats, setStats] = useState<PlacementStats | null>(null);
    const [error, setError] = useState<string>("");

    const fetchStats = async () => {
        try {
            const response = await axios.get("http://localhost:8000/placement/stats", {
                withCredentials: true,
            });
            setStats(response.data.stats);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch placement statistics.");
            setStats(null);
        }
    };

    useEffect(() => {
        if (userData?.userType === "tpo") {
            fetchStats();
        }
    }, [userData]);

    if (!userData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">Loading...</div>
            </div>
        );
    }

    if (userData.userType !== "tpo") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    Unauthorized: Only TPO users can access this dashboard.
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center">
                <div className="bg-muted p-4 rounded-lg">Loading statistics...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">

            <div
                className="fixed w-72 h-72 opacity-40 blur-3xl rounded-full top-0 left-1/2 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 68%) 0%, transparent 70%)",
                }}
            />
            <div
                className="fixed w-64 h-64 opacity-40 blur-2xl rounded-full bottom-0 left-6 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 78%) 0%, transparent 80%)",
                }}
            />
            <div
                className="fixed w-64 h-64 opacity-40 blur-2xl rounded-full top-1/3 left-1/4 z-[-1]"
                style={{
                    background: "radial-gradient(circle, hsl(98, 67%, 73%) 0%, transparent 80%)",
                }}
            />
            <div
                className="fixed w-80 h-80 opacity-40 blur-3xl rounded-full bottom-1/4 right-20 z-[-1]"
                style={{
                    background: "radial-gradient(circle at center, hsl(98, 67%, 70%) 0%, transparent 75%)",
                }}
            />
            <AdminNavbar />
            <div className="p-6 space-y-6">
                {/* Header */}


                {/* Profile Card */}
                <Card className="bg-white/40 border-border/80 shadow-[var(--shadow-card)]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <Badge variant="secondary">TPO</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Students"
                        value={stats.totalStudents.toString()}
                        icon={User}
                        trend={stats.totalStudents > 0 ? `+${stats.totalStudents}` : "0"}
                        className="col-span-1"

                    />
                    <StatsCard
                        title="Total Placements"
                        value={stats.totalPlacements.toString()}
                        icon={FileText}
                        trend={stats.totalPlacements > 0 ? `+${stats.totalPlacements}` : "0"}
                        className="col-span-1 "
                    />
                    <StatsCard
                        title="Students Placed"
                        value={stats.totalStudentsPlaced.toString()}
                        icon={Award}
                        trend={stats.totalStudentsPlaced > 0 ? `+${stats.totalStudentsPlaced}` : "0"}
                        className="col-span-1"
                    />
                    <StatsCard
                        title="Placement Percentage"
                        value={stats.placementPercentage}
                        icon={TrendingUp}
                        trend={parseFloat(stats.placementPercentage) > 0 ? `+${stats.placementPercentage}` : "0%"}
                        className="col-span-1"
                    />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  ">
                    {/* CTC Statistics */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white/40 border-border/80 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5 text-primary" />
                                    CTC Statistics
                                </CardTitle>
                                <CardDescription>Overview of placement package details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <h4 className="font-medium">Average CTC</h4>
                                        <p className="text-xl font-bold">₹{parseFloat(stats.averageCTC).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <h4 className="font-medium">Highest CTC</h4>
                                        <p className="text-xl font-bold">₹{stats.highestCTC.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <h4 className="font-medium">Lowest CTC</h4>
                                        <p className="text-xl font-bold">₹{stats.lowestCTC.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Placements by Year */}
                    <div>
                        <Card className="bg-white/40 border-border/80 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    Placements by Year
                                </CardTitle>
                                <CardDescription>Annual placement distribution</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-0">
                                    {Object.entries(stats.placementsByYear).map(([year, count]) => (
                                        <div
                                            key={year}
                                            className="p-4 hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm">{year}</h4>
                                                <Badge variant="outline">
                                                    {count} placement{count !== 1 ? "s" : ""}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Package Components */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white/40 border-border/80 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IndianRupee className="w-5 h-5 text-primary" />
                                    Package Components
                                </CardTitle>
                                <CardDescription>Breakdown of compensation components</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(stats.packageComponents).map(([component, data]) => (
                                    <div
                                        key={component}
                                        className="p-4 bg-muted/20 rounded-lg border border-border/80"
                                    >
                                        <h4 className="font-medium capitalize">{component}</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p>Total: ₹{data.total.toLocaleString()}</p>
                                            <p>Average: ₹{parseFloat(data.average).toLocaleString()}</p>
                                            <p>Highest: ₹{data.highest.toLocaleString()}</p>
                                            <p>Lowest: ₹{data.lowest.toLocaleString()}</p>
                                            <p>Count: {data.count}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Companies and Top CTC Offers */}
                    <div>
                        <Card className="bg-white/20 border-0 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Top Companies
                                </CardTitle>
                                <CardDescription>Leading recruiters by placement count</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-0">
                                    {stats.topCompanies.map((company) => (
                                        <div
                                            key={company.companyId}
                                            className="p-4 hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm">{company.name}</h4>
                                                <Badge variant="outline">
                                                    {company.count} placement{company.count !== 1 ? "s" : ""}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="bg-white/40 border-border/80 shadow-[var(--shadow-card)]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-primary" />
                                    Top CTC Offers
                                </CardTitle>
                                <CardDescription>Highest compensation packages</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {stats.topCTCOffers.map((offer) => (
                                    <div
                                        key={offer._id}
                                        className="p-4 bg-muted/20 rounded-lg border border-border/50"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-medium">{offer.companyName}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Student: {offer.studentName || "Anonymous"}
                                                </p>
                                            </div>
                                            <p className="font-medium">₹{offer.totalCTC.toLocaleString()}</p>
                                        </div>
                                        <div className="text-sm">
                                            <h5 className="font-medium">Package Breakdown:</h5>
                                            <ul className="space-y-1">
                                                {offer.package.map((pkg) => (
                                                    <li key={pkg._id} className="text-muted-foreground">
                                                        <span className="capitalize">{pkg.componentName}</span>: ₹
                                                        {pkg.amount.toLocaleString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;