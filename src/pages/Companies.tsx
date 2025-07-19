import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Calendar, DollarSign, GraduationCap } from "lucide-react";

interface PackageComponent {
    componentName: string;
    amount: number;
    _id: string;
}

interface Application {
    _id: string;
    userId: string;
    companyId: string;
    status: string;
    createdAt: string;
}

interface Company {
    name: string;
    eligibilityCgpa: number;
    package: PackageComponent[] | string;
    location: string;
    deadline: string;
    _id: string;
}

const ApplyJobs = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companiesResponse = await axios.get("http://localhost:8000/company/getAllCompanies", {
                    withCredentials: true,
                });
                let fetchedCompanies = companiesResponse.data.data.companies || [];

                const applicationsResponse = await axios.get("http://localhost:8000/application/getAllApplicationsByUser", {
                    withCredentials: true,
                });
                const fetchedApplications = applicationsResponse.data.applications || [];

                setApplications(fetchedApplications);
                setCompanies(fetchedCompanies);

                const now = new Date("2025-07-20T03:05:00+05:30");
                setCompanies(prev => [...prev].sort((a, b) => {
                    const aExpired = new Date(a.deadline) < now;
                    const aApplied = fetchedApplications.some(app => app.companyId === a._id && app.status !== "rejected");
                    const bExpired = new Date(b.deadline) < now;
                    const bApplied = fetchedApplications.some(app => app.companyId === b._id && app.status !== "rejected");

                    if (!aExpired && !aApplied && (bExpired || bApplied)) return -1;
                    if (!bExpired && !bApplied && (aExpired || aApplied)) return 1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                }));
            } catch (err: any) {
                setError("Failed to fetch data. Please try again later.");
                console.error("Error fetching data:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApply = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleConfirmApply = async () => {
        if (!selectedCompany) return;

        try {
            const response = await axios.post(
                `http://localhost:8000/application/apply/${selectedCompany._id}`,
                {},
                { withCredentials: true }
            );
            setApplications(prev => [...prev, {
                _id: response.data._id,
                userId: "",
                companyId: selectedCompany._id,
                status: "pending",
                createdAt: new Date().toISOString()
            }]);
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit application.");
        }
    };

    const formatPackage = (pkg: PackageComponent[] | string) => {
        if (typeof pkg === "string") return pkg;
        return pkg.reduce((acc, p) => acc + (parseFloat(p.amount.toString()) || 0), 0).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isExpired = (deadline: string) => {
        const now = new Date("2025-07-20T03:05:00+05:30");
        return new Date(deadline) < now;
    };

    const isApplied = (companyId: string) => {
        return applications.some(app => app.companyId === companyId && app.status !== "rejected");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent text-gray-200 p-6">
                <div className="p-4 rounded-lg flex items-center gap-2 bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading job opportunities...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-transparent text-gray-200 p-6">
                <div className="p-4 rounded-lg bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-gray-200 relative overflow-hidden">
            {/* Background Blobs */}
            <div
                className="absolute w-72 h-72 opacity-50 blur-3xl rounded-full top-0 left-1/2 z-[-1]"
                style={{ background: "radial-gradient(circle at center, hsl(98, 67%, 68%) 0%, transparent 70%)" }}
            />
            <div
                className="absolute w-64 h-64 opacity-50 blur-2xl rounded-full bottom-0 left-6 z-[-1]"
                style={{ background: "radial-gradient(circle, hsl(98, 67%, 78%) 0%, transparent 80%)" }}
            />
            <div
                className="absolute w-64 h-64 opacity-50 blur-2xl rounded-full top-1/3 left-1/4 z-[-1]"
                style={{ background: "radial-gradient(circle, hsl(98, 67%, 73%) 0%, transparent 80%)" }}
            />
            <div
                className="absolute w-80 h-80 opacity-50 blur-3xl rounded-full bottom-1/4 right-20 z-[-1]"
                style={{ background: "radial-gradient(circle at center, hsl(98, 67%, 70%) 0%, transparent 75%)" }}
            />
            <Navbar />
            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-start gap-4">
                    <h1 className="text-3xl font-bold text-[#252525]">
                        Explore Job Opportunities
                    </h1>
                    <p className="text-[#616161] mt-1">Discover and apply to available company placements</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => {
                        const expired = isExpired(company.deadline);
                        const applied = isApplied(company._id) && !expired;

                        return (
                            <Card
                                key={company._id}
                                className={`border-border/80 shadow-lg transition-all duration-300 hover:shadow-xl bg-[#FAFAFA] ${expired || applied ? "opacity-70" : ""}`}
                            >
                                <CardHeader className="p-6 pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl text-[#252525]">
                                        <div className="p-2 bg-[#9FE477]/20 rounded-lg">
                                            <Building2 className="w-5 h-5 text-[#9FE477]" />
                                        </div>
                                        {company.name}
                                    </CardTitle>
                                    <p className="text-sm text-[#616161]">{company.location}</p>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-sm text-[#616161]">
                                            <DollarSign className="w-4 h-4 text-[#9FE477]" />
                                            <div>
                                                <p className="font-medium text-[#252525]">CTC</p>
                                                <p>{formatPackage(company.package)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#616161]">
                                            <GraduationCap className="w-4 h-4 text-[#9FE477]" />
                                            <div>
                                                <p className="font-medium text-[#252525]">Min CGPA</p>
                                                <p>{company.eligibilityCgpa}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#f5f5f5] rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-[#252525]">Application Deadline</h4>
                                        </div>
                                        <p className="text-sm text-[#616161] flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-[#9FE477]" />
                                            {formatDate(company.deadline)}
                                        </p>
                                    </div>
                                    <Button
                                        className={`w-full ${expired || applied ? 'bg-[#252525] text-[#f3f3f3]' : 'bg-[#9FE477] text-[#252525] hover:bg-[#7AC142]'}`}
                                        onClick={() => !expired && !applied && handleApply(company)}
                                        disabled={expired || applied}
                                    >
                                        {expired ? "Expired" : applied ? "Applied" : "Apply Now"}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="bg-[#FAFAFA] border-0 max-w-md p-6 rounded-2xl shadow-2xl">
                        <DialogHeader className="p-4 pb-3 bg-[#9FE477]/20">
                            <DialogTitle className="flex items-center gap-3 text-xl text-[#252525]">
                                <Building2 className="w-5 h-5 text-[#9FE477]" />
                                Apply for {selectedCompany?.name}
                            </DialogTitle>
                            <p className="text-[#616161] text-sm">
                                Confirm your application for this position
                            </p>
                        </DialogHeader>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-[#616161]">
                                Are you sure you want to apply for this position? Please ensure your CGPA meets the requirement of {selectedCompany?.eligibilityCgpa || "N/A"}.
                            </p>
                        </div>
                        <DialogFooter className="p-4 pt-0 flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="border-[#e0e0e0] text-[#616161] hover:bg-[#f5f5f5]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmApply}
                                className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]"
                            >
                                Confirm Application
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ApplyJobs;