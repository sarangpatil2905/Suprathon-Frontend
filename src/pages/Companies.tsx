import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
                // Fetch companies
                const companiesResponse = await axios.get("http://localhost:8000/company/getAllCompanies", {
                    withCredentials: true,
                });
                let fetchedCompanies = companiesResponse.data.data.companies || [];

                // Fetch applications
                const applicationsResponse = await axios.get("http://localhost:8000/application/getAllApplicationsByUser", {
                    withCredentials: true,
                });
                const fetchedApplications = applicationsResponse.data.applications || [];

                setApplications(fetchedApplications);
                setCompanies(fetchedCompanies);

                // Sort by earliest deadline for active jobs, then expired/applied
                const now = new Date("2025-07-20T02:03:00+05:30"); // Current date and time in IST
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

    if (loading) return <div className="min-h-screen bg-gray-50 p-8 text-center">Loading...</div>;
    if (error) return <div className="min-h-screen bg-gray-50 p-8 text-center text-red-500">{error}</div>;

    const handleApply = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleConfirmApply = async () => {
        if (!selectedCompany) return;

        try {
            const response = await axios.post(
                `http://localhost:8000/application/apply/${selectedCompany._id}`, {},
                { withCredentials: true }
            );
            console.log("Application submitted:", response.data);
            setApplications(prev => [...prev, { _id: response.data._id, userId: "", companyId: selectedCompany._id, status: "pending", createdAt: new Date().toISOString() }]);
            setIsModalOpen(false);
        } catch (err: any) {
            console.log(err);
            alert(err.response.data.message);
        }
    };

    const formatPackage = (pkg: PackageComponent[] | string) => {
        if (typeof pkg === "string") return pkg;
        return pkg.map(p => `${p.componentName}: ${p.amount} LPA`).join(", ");
    };

    const isExpired = (deadline: string) => {
        const now = new Date("2025-07-20T02:03:00+05:30"); // Current date and time in IST
        return new Date(deadline) < now;
    };

    const isApplied = (companyId: string) => {
        return applications.some(app => app.companyId === companyId && app.status !== "rejected");
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-10 text-center" style={{ color: "#9FE477" }}>
                        Explore Job Opportunities
                    </h1>

                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {companies.map((company, idx) => {
                            const expired = isExpired(company.deadline);
                            const applied = isApplied(company._id) && !expired; // Show "Applied" only for non-expired jobs

                            return (
                                <Card
                                    key={idx}
                                    className={`rounded-2xl border border-gray-200 shadow-md transition-all duration-200 bg-white ${expired || applied ? "opacity-50 cursor-not-allowed" : ""}`}
                                    style={{ boxShadow: "0 4px 20px rgba(159, 228, 119, 0.3)" }}
                                >
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-2xl" style={{ color: "#9FE477" }}>
                                            {company.name}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500">{company.location}</p>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-600">CGPA Required: </span>
                                            {company.eligibilityCgpa}
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-600">Package: </span>
                                            {formatPackage(company.package)}
                                        </div>

                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-600">Deadline: </span>
                                            {company.deadline}
                                        </div>

                                        <Button
                                            className="w-full text-white mt-4"
                                            style={{
                                                backgroundColor: "#9FE477",
                                                color: "#1B1B1B",
                                            }}
                                            onMouseOver={(e) => !expired && !applied && (e.currentTarget.style.backgroundColor = "#8BD65C")}
                                            onMouseOut={(e) => !expired && !applied && (e.currentTarget.style.backgroundColor = "#9FE477")}
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
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Apply for {selectedCompany?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to apply for this position? Please ensure your CGPA meets the requirements of {selectedCompany?.eligibilityCgpa || "N/A"}.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmApply}>Confirm Application</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default ApplyJobs;