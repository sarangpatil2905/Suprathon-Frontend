import React, { useEffect, useState } from "react";
import axios from "axios";

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

const PlacementStats: React.FC = () => {
    const [stats, setStats] = useState<PlacementStats | null>(null);
    const [error, setError] = useState<string>("");

    const fetchStats = async () => {
        try {
            const res = await axios.get("http://localhost:8000/placement/stats", {
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
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Placement Statistics</h1>

            {/* General Stats */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">General Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Total Students</h3>
                        <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Total Placements</h3>
                        <p className="text-2xl font-bold">{stats.totalPlacements}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Students Placed</h3>
                        <p className="text-2xl font-bold">{stats.totalStudentsPlaced}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Total Companies</h3>
                        <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Placement Percentage</h3>
                        <p className="text-2xl font-bold">{stats.placementPercentage}</p>
                    </div>
                </div>
            </div>

            {/* CTC Stats */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">CTC Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Average CTC</h3>
                        <p className="text-2xl font-bold">₹{parseFloat(stats.averageCTC).toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Highest CTC</h3>
                        <p className="text-2xl font-bold">₹{stats.highestCTC.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-5">
                        <h3 className="text-lg font-medium text-gray-700">Lowest CTC</h3>
                        <p className="text-2xl font-bold">₹{stats.lowestCTC.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Package Components */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Package Components</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(stats.packageComponents).map(([component, data]) => (
                        <div key={component} className="bg-white rounded-2xl shadow-md p-5">
                            <h3 className="text-lg font-semibold capitalize mb-2">{component}</h3>
                            <p className="text-sm text-gray-700">Total: ₹{data.total.toLocaleString()}</p>
                            <p className="text-sm text-gray-700">Average: ₹{parseFloat(data.average).toLocaleString()}</p>
                            <p className="text-sm text-gray-700">Highest: ₹{data.highest.toLocaleString()}</p>
                            <p className="text-sm text-gray-700">Lowest: ₹{data.lowest.toLocaleString()}</p>
                            <p className="text-sm text-gray-700">Count: {data.count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Placements by Year */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Placements by Year</h2>
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <ul className="space-y-2">
                        {Object.entries(stats.placementsByYear).map(([year, count]) => (
                            <li key={year} className="text-sm text-gray-700">
                                <span className="font-semibold">{year}:</span> {count} placement{count !== 1 ? "s" : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Top Companies */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Top Companies</h2>
                <div className="bg-white rounded-2xl shadow-md p-5">
                    <ul className="space-y-2">
                        {stats.topCompanies.map((company) => (
                            <li key={company.companyId} className="text-sm text-gray-700">
                                <span className="font-semibold">{company.name}:</span> {company.count} placement{company.count !== 1 ? "s" : ""}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Top CTC Offers */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Top CTC Offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {stats.topCTCOffers.map((offer) => (
                        <div key={offer._id} className="bg-white rounded-2xl shadow-md p-5">
                            <h3 className="text-lg font-semibold mb-2">{offer.companyName}</h3>
                            <p className="text-sm text-gray-700">Student: {offer.studentName || "Anonymous"}</p>
                            <p className="text-sm text-gray-700">Total CTC: ₹{offer.totalCTC.toLocaleString()}</p>
                            <h4 className="text-sm font-medium mt-2">Package Breakdown:</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {offer.package.map((pkg) => (
                                    <li key={pkg._id}>
                                        <span className="capitalize">{pkg.componentName}</span>: ₹{pkg.amount.toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlacementStats;