import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/assets/constants";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ComposedChart,
    Area,
    AreaChart
} from "recharts";
import {
    TrendingUp,
    Users,
    Building2,
    Award,
    DollarSign,
    Target,
    Briefcase,
    GraduationCap,
    TrendingDown
} from "lucide-react";
import { useUser } from "@/context/UserContext";

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

const CHART_COLORS = ['#9FE477', '#7BC859', '#5BAD3B', '#3E8F27', '#2D6B1D'];

const PlacementStats: React.FC = () => {
    const { userData } = useUser();
    const [stats, setStats] = useState<PlacementStats | null>(null);
    const [error, setError] = useState<string>("");

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/placement/stats`, {
                withCredentials: true,
            });
            setStats(res.data.stats);
            setError("");
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch placement statistics.");
            setStats(null);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                <Card className="border-destructive">
                    <CardContent className="p-6">
                        <p className="text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-background p-6 flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Transform data for charts
    const ctcComparisonData = [
        { name: 'Average', value: parseFloat(stats.averageCTC), icon: DollarSign },
        { name: 'Highest', value: stats.highestCTC, icon: TrendingUp },
        { name: 'Lowest', value: stats.lowestCTC, icon: TrendingDown },
    ];

    const packageComponentsData = Object.entries(stats.packageComponents).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        total: data.total,
        average: parseFloat(data.average),
        count: data.count,
    }));

    const placementsByYearData = Object.entries(stats.placementsByYear).map(([year, count]) => ({
        year,
        placements: count,
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

    const companyData = stats.topCompanies.slice(0, 8).map(company => ({
        name: company.name.length > 15 ? company.name.substring(0, 15) + '...' : company.name,
        count: company.count,
    }));

    const placementPercentage = parseFloat(stats.placementPercentage);

    return (
        <div className="min-h-screen bg-transparent">
            {/* Background Blobs */}
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
            <Navbar />
            {/* Hero Section */}
            <div className="relative p-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center space-y-4 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                            Placement Tracker
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive insights into student placements and career outcomes
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto p-6 space-y-8">
                {/* Key Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">
                    <Card className="hover-lift bg-white/20">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Students</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalStudents}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-white/20">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Placement Rate</p>
                                    <p className="text-3xl font-bold text-primary">{stats.placementPercentage}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-white/20">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Partner Companies</p>
                                    <p className="text-3xl font-bold text-foreground">{stats.totalCompanies}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift bg-white/20">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Highest Package</p>
                                    <p className="text-2xl font-bold text-foreground">₹{stats.highestCTC.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Card className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up bg-white/20">
                    {/* Placement Percentage Circular Progress */}
                    <Card className="chart-container hover-lift border-none shadow-none bg-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Placement Success Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-48 h-48">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary">{stats.placementPercentage}</div>
                                            <div className="text-sm text-muted-foreground">Success Rate</div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Placed', value: placementPercentage, fill: '#9FE477' },
                                                    { name: 'Remaining', value: 100 - placementPercentage, fill: '#f0f0f0' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                startAngle={90}
                                                endAngle={450}
                                                dataKey="value"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-around w-full text-sm">
                                    <span className="text-primary font-medium">{stats.totalStudentsPlaced} Placed</span>
                                    <span className="text-muted-foreground">{stats.totalStudents - stats.totalStudentsPlaced} Remaining</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTC Comparison Chart */}
                    <Card className="chart-container hover-lift border-none shadow-none bg-transparent">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                CTC Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={ctcComparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip
                                        formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'CTC']}
                                        labelStyle={{ color: '#252525' }}
                                    />
                                    <Bar dataKey="value" fill="#9FE477" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Card>

                {/* Package Components & Year Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Package Components Pie Chart */}
                    <Card className="chart-container hover-lift bg-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Package Components
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={packageComponentsData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="total"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {packageComponentsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Total']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Placements by Year Trend */}
                    <Card className="chart-container hover-lift bg-white/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Placement Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={placementsByYearData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="year" stroke="#666" fontSize={12} />
                                    <YAxis stroke="#666" fontSize={12} />
                                    <Tooltip
                                        formatter={(value) => [`${value}`, 'Placements']}
                                        labelStyle={{ color: '#252525' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="placements"
                                        stroke="#9FE477"
                                        fill="#9FE477"
                                        fillOpacity={0.3}
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Companies Chart */}
                <Card className="chart-container hover-lift animate-fade-in bg-white/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Top Recruiting Companies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={companyData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" stroke="#666" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#666" fontSize={12} width={120} />
                                <Tooltip
                                    formatter={(value) => [`${value}`, 'Placements']}
                                    labelStyle={{ color: '#252525' }}
                                />
                                <Bar dataKey="count" fill="#9FE477" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top CTC Offers */}
                <Card className="hover-lift animate-slide-up bg-white/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Top CTC Offers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {stats.topCTCOffers.map((offer, index) => (
                                <Card key={offer._id} className="relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg text-foreground">{offer.companyName}</CardTitle>
                                            <Badge className="bg-primary text-primary-foreground">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {offer.studentName || "Anonymous"}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <div className="text-2xl font-bold text-primary">
                                                ₹{offer.totalCTC.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total Package</div>
                                        </div>
                                        <div className="space-y-2">
                                            {offer.package.map((pkg) => (
                                                <div key={pkg._id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                                    <span className="capitalize text-sm text-muted-foreground">
                                                        {pkg.componentName}
                                                    </span>
                                                    <span className="text-sm font-medium text-foreground">
                                                        ₹{pkg.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
            <Footer />
        </div >
    );
};

export default PlacementStats;