import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminNavbar from "@/components/AdminNavbar";
import { useEffect, useState } from "react";
import {
    Building2,
    Calendar,
    DollarSign,
    FileText,
    Plus,
    Edit,
    X,
    Loader2,
    Save,
    ChevronDown,
    ChevronUp,
    Trash2,
    Clock,
    Phone,
    Mail,
    GraduationCap,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/assets/constants";

interface ScheduleEvent {
    _id?: string;
    eventName: string;
    date: string;
    description?: string;
}

interface PackageComponent {
    _id?: string;
    componentName: string;
    amount: number;
}

interface Company {
    _id: string;
    name: string;
    year: number;
    eligibilityCgpa: number;
    email: string;
    phone: string;
    schedule: ScheduleEvent[];
    package: PackageComponent[];
    file?: string;
    deadline: string | Date;
}

interface Interview {
    company: string;
    round: string;
    status: string;
}

interface CalendarDay {
    date: number;
    month: string;
    isPast: boolean;
    hasEvents: boolean;
    interviews: Interview[];
}

const AdminCompanies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [calendarModalOpen, setCalendarModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [activeSection, setActiveSection] = useState<'basic' | 'schedule' | 'package'>('basic');
    const [updateForm, setUpdateForm] = useState({
        name: "",
        year: "",
        eligibilityCgpa: "",
        phone: "",
        schedule: [{ eventName: "", date: "", description: "" }],
        package: [{ componentName: "", amount: "" }],
    });
    const [updateMessage, setUpdateMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
    const [addFile, setAddFile] = useState<File | null>(null);
    const [addMessage, setAddMessage] = useState<{ text: string; isError: boolean }>({ text: "", isError: false });
    const [expandedSchedule, setExpandedSchedule] = useState<number[]>([]);
    const [expandedPackage, setExpandedPackage] = useState<number[]>([]);
    const [packageModalStates, setPackageModalStates] = useState<{ [key: string]: boolean }>({});
    const [weekOffset, setWeekOffset] = useState(0);
    const maxOffset = 4;

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${BASE_URL}/company/getAllCompanies`, {
                withCredentials: true,
            });
            const companies = response.data.data.companies || [];
            const sortedCompanies = [...companies].sort((a, b) => {
                const now = new Date();
                const deadlineA = new Date(a.deadline);
                const deadlineB = new Date(b.deadline);
                const isExpiredA = isNaN(deadlineA.getTime()) ? false : deadlineA < now;
                const isExpiredB = isNaN(deadlineB.getTime()) ? false : deadlineB < now;

                if (!isExpiredA && isExpiredB) return -1;
                if (isExpiredA && !isExpiredB) return 1;
                if (isExpiredA && isExpiredB) return deadlineA.getTime() - deadlineB.getTime();
                return deadlineA.getTime() - deadlineB.getTime();
            });
            setCompanies(sortedCompanies);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch companies.");
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleUpdateClick = (company: Company) => {
        setSelectedCompany(company);
        setUpdateForm({
            name: company.name,
            year: company.year.toString(),
            eligibilityCgpa: company.eligibilityCgpa.toString(),
            phone: company.phone || "",
            schedule: company.schedule.map((s) => ({
                eventName: s.eventName,
                date: s.date.includes('T') ? s.date : s.date + 'T10:00',
                description: s.description || "",
            })),
            package: company.package.map((p) => ({
                componentName: p.componentName,
                amount: p.amount.toString(),
            })),
        });
        setUpdateMessage({ text: "", isError: false });
        setActiveSection('basic');
        setExpandedSchedule([]);
        setExpandedPackage([]);
        setUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;

        // Basic input validation
        if (!updateForm.name.trim()) {
            setUpdateMessage({ text: "Company name is required.", isError: true });
            return;
        }
        if (!updateForm.year || isNaN(parseInt(updateForm.year)) || parseInt(updateForm.year) < 2000) {
            setUpdateMessage({ text: "Valid academic year is required.", isError: true });
            return;
        }
        if (!updateForm.eligibilityCgpa || isNaN(parseFloat(updateForm.eligibilityCgpa)) || parseFloat(updateForm.eligibilityCgpa) < 0) {
            setUpdateMessage({ text: "Valid CGPA is required.", isError: true });
            return;
        }

        try {
            const updates = {
                name: updateForm.name.trim(),
                year: parseInt(updateForm.year),
                eligibilityCgpa: parseFloat(updateForm.eligibilityCgpa),
                phone: updateForm.phone.trim(),
                schedule: updateForm.schedule.map((s) => ({
                    eventName: s.eventName.trim(),
                    date: s.date,
                    description: s.description?.trim() || "",
                })),
                package: updateForm.package.map((p) => ({
                    componentName: p.componentName.trim(),
                    amount: parseFloat(p.amount) || 0,
                })),
            };
            const response = await axios.patch(
                `${BASE_URL}/company/update-company/${selectedCompany._id}`,
                updates,
                { withCredentials: true }
            );
            setUpdateMessage({ text: response.data.message || "Company updated successfully!", isError: false });
            setTimeout(() => {
                setUpdateModalOpen(false);
                setSelectedCompany(null);
                setUpdateMessage({ text: "", isError: false });
                fetchCompanies();
            }, 1500);
        } catch (err: any) {
            setUpdateMessage({
                text: err.response?.data?.message || "Failed to update company.",
                isError: true,
            });
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFile) {
            setAddMessage({ text: "Please select a PDF file.", isError: true });
            return;
        }

        setAddMessage({ text: "Uploading...", isError: false });
        const formData = new FormData();
        formData.append("file", addFile);

        try {
            const response = await axios.post(
                `${BASE_URL}/company/add-company`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setAddMessage({ text: response.data.message || "Company added successfully!", isError: false });
            setTimeout(() => {
                setAddModalOpen(false);
                setAddFile(null);
                setAddMessage({ text: "", isError: false });
                fetchCompanies();
            }, 1500);
        } catch (err: any) {
            setAddMessage({
                text: err.response?.data?.message || "Failed to add company.",
                isError: true,
            });
        }
    };

    const addScheduleEvent = () => {
        setUpdateForm((prev) => ({
            ...prev,
            schedule: [...prev.schedule, { eventName: "", date: "", description: "" }],
        }));
    };

    const updateScheduleEvent = (index: number, field: keyof ScheduleEvent, value: string) => {
        setUpdateForm((prev) => {
            const newSchedule = [...prev.schedule];
            newSchedule[index] = { ...newSchedule[index], [field]: value };
            return { ...prev, schedule: newSchedule };
        });
    };

    const removeScheduleEvent = (index: number) => {
        setUpdateForm((prev) => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index),
        }));
        setExpandedSchedule(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    };

    const addPackageComponent = () => {
        setUpdateForm((prev) => ({
            ...prev,
            package: [...prev.package, { componentName: "", amount: "" }],
        }));
    };

    const updatePackageComponent = (index: number, field: keyof PackageComponent, value: string) => {
        setUpdateForm((prev) => {
            const newPackage = [...prev.package];
            newPackage[index] = { ...newPackage[index], [field]: value };
            return { ...prev, package: newPackage };
        });
    };

    const removePackageComponent = (index: number) => {
        setUpdateForm((prev) => ({
            ...prev,
            package: prev.package.filter((_, i) => i !== index),
        }));
        setExpandedPackage(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
    };

    const toggleScheduleExpansion = (index: number) => {
        setExpandedSchedule(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const togglePackageExpansion = (index: number) => {
        setExpandedPackage(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const togglePackageModal = (companyId: string) => {
        setPackageModalStates(prev => ({
            ...prev,
            [companyId]: !prev[companyId]
        }));
    };

    const isCompleted = (deadline: string | Date) => {
        const date = new Date(deadline);
        return isNaN(date.getTime()) ? false : date > new Date();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    // Calendar logic
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getFourWeeksDays = (offset: number) => {
        const today = new Date();
        today.setDate(today.getDate() + offset * 7);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);

        const fourWeeksDays: CalendarDay[] = [];
        for (let i = 0; i < 28; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const interviews = companies
                .flatMap(company => company.schedule)
                .filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.toDateString() === day.toDateString();
                })
                .map(event => ({
                    company: companies.find(c => c.schedule.includes(event))?.name || '',
                    round: event.eventName,
                    status: 'scheduled'
                }));

            fourWeeksDays.push({
                date: day.getDate(),
                month: day.toLocaleString('en-IN', { month: 'short' }),
                isPast: day < new Date(new Date().setHours(0, 0, 0, 0)),
                hasEvents: interviews.length > 0,
                interviews
            });
        }
        return fourWeeksDays;
    };

    const formatDateRange = () => {
        const today = new Date();
        today.setDate(today.getDate() + weekOffset * 7);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    const handlePreviousWeek = () => {
        setWeekOffset(prev => prev - 1);
    };

    const handleNextWeek = () => {
        setWeekOffset(prev => prev + 1);
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
            <AdminNavbar />
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#252525]">
                            Manage Companies
                        </h1>
                        <p className="text-[#616161] mt-1">View, add, and update company details</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Button
                            onClick={() => setAddModalOpen(true)}
                            className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525] shadow-lg w-full md:w-auto"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Add Company
                        </Button>
                        <Button
                            onClick={() => setCalendarModalOpen(true)}
                            className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525] shadow-lg w-full md:w-auto"
                        >
                            <Calendar className="w-5 h-5 mr-2" /> Calendar
                        </Button>
                    </div>
                </div>

                {/* Error or Loading Message */}
                {(error || loading) && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${error ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]' : 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]'}`}>
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading companies...
                            </>
                        ) : (
                            error
                        )}
                    </div>
                )}

                {/* Companies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <Card
                            key={company._id}
                            className="border-border/80 shadow-lg transition-all duration-300 hover:shadow-xl bg-[#FAFAFA]"
                        >
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl text-[#252525]">
                                    <div className="p-2 bg-[#9FE477]/20 rounded-lg">
                                        <Building2 className="w-5 h-5 text-[#9FE477]" />
                                    </div>
                                    {company.name}
                                </CardTitle>
                                <CardDescription className="text-[#616161]">Company placement details</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-[#616161]">
                                        <DollarSign className="w-4 h-4 text-[#9FE477]" />
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-[#252525]">CTC</p>
                                            <p>{formatCurrency(company.package.reduce((acc, p) => acc + p.amount, 0))}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => togglePackageModal(company._id)}
                                                className="p-1 h-auto text-[#9FE477] hover:text-[#7AC142] hover:bg-[#9FE477]/10"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Button>
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

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-[#616161]">
                                        <Mail className="w-4 h-4 text-[#9FE477]" />
                                        <span className="truncate">{company.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#616161]">
                                        <Phone className="w-4 h-4 text-[#9FE477]" />
                                        <span>{company.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#616161]">
                                        <CalendarDays className="w-4 h-4 text-[#9FE477]" />
                                        <span>Year {company.year}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-[#f5f5f5] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-[#252525]">Application Deadline</h4>
                                    </div>
                                    <p className="text-sm text-[#616161] flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-[#9FE477]" />
                                        {formatDate(company.deadline)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-[#252525] mb-2">Upcoming Events</h4>
                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                        {company.schedule.slice(0, 2).map((event) => (
                                            <div key={event._id} className="text-xs p-2 bg-[#9FE477]/10 rounded">
                                                <p className="font-medium text-[#252525]">{event.eventName}</p>
                                                <p className="text-[#616161]">{formatDate(event.date)}</p>
                                            </div>
                                        ))}
                                        {company.schedule.length > 2 && (
                                            <p className="text-xs text-[#757575]">+{company.schedule.length - 2} more events</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleUpdateClick(company)}
                                    className="w-full bg-[#252525] hover:bg-[#9FE477]/80 text-[#f3f3f3] hover:text-[#252525]"
                                >
                                    <Edit className="w-4 h-4 mr-2" /> Edit Company
                                </Button>
                                <Button
                                    onClick={() => { navigate(`/accept-admin/${company._id}`) }}
                                    disabled={isCompleted(company.schedule[company.schedule.length - 1]?.date)}
                                    className={`w-full ${isCompleted(company.schedule[company.schedule.length - 1]?.date) ? 'bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]' : 'bg-[#252525] hover:bg-[#9FE477]/80 text-[#f3f3f3] hover:text-[#252525]'}`}
                                >
                                    <Check className="w-4 h-4 mr-2" /> {isCompleted(company.schedule[company.schedule.length - 1]?.date) ? "Ongoing" : "Finalize Students"}
                                </Button>
                            </CardContent>

                            {/* Package Split Modal */}
                            {packageModalStates[company._id] && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <Card className="bg-[#FAFAFA] border-0 w-full max-w-sm p-6 rounded-2xl shadow-2xl">
                                        <CardHeader className="p-4 pb-3 bg-[#9FE477]/20">
                                            <CardTitle className="flex items-center gap-2 text-lg text-[#252525]">
                                                <DollarSign className="w-5 h-5 text-[#9FE477]" />
                                                Package Split for {company.name}
                                            </CardTitle>
                                            <CardDescription className="text-[#616161]">
                                                Breakdown of compensation components
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-3">
                                            {company.package.map((pkg, index) => (
                                                <div key={index} className="flex justify-between text-sm text-[#616161]">
                                                    <span>{pkg.componentName}</span>
                                                    <span>{formatCurrency(pkg.amount)}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-end gap-4 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => togglePackageModal(company._id)}
                                                    className="w-full md:w-auto border-[#e0e0e0] text-[#616161] hover:bg-[#f5f5f5]"
                                                >
                                                    Close
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                {/* Update Company Modal */}
                {updateModalOpen && selectedCompany && (
                    <div className="fixed inset-0 mt-0 z-50">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <Card className="bg-[#FAFAFA] border-0 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl rounded-2xl">
                                <CardHeader className="p-6 pb-4 bg-[#9FE477]/20">
                                    <CardTitle className="flex items-center gap-3 text-2xl text-[#252525]">
                                        <Edit className="w-6 h-6 text-[#9FE477]" />
                                        Update {selectedCompany.name}
                                    </CardTitle>
                                    <CardDescription className="text-[#616161]">
                                        Modify company placement details
                                    </CardDescription>
                                </CardHeader>

                                <div className="flex border-b bg-[#f5f5f5]">
                                    {(['basic', 'schedule', 'package'] as const).map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => setActiveSection(section)}
                                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeSection === section
                                                ? 'text-[#9FE477] border-b-2 border-[#9FE477] bg-[#FAFAFA]'
                                                : 'text-[#616161] hover:text-[#252525]'
                                                }`}
                                        >
                                            {section === 'basic' && 'Basic Info'}
                                            {section === 'schedule' && `Schedule (${updateForm.schedule.length})`}
                                            {section === 'package' && `Package (${updateForm.package.length})`}
                                        </button>
                                    ))}
                                </div>

                                <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
                                    <form onSubmit={handleUpdateSubmit} className="space-y-6">
                                        {activeSection === 'basic' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-semibold text-[#252525]">
                                                        Company Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={updateForm.name}
                                                        onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="h-11 border-[#e0e0e0] focus:border-[#9FE477]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="year" className="text-sm font-semibold text-[#252525]">
                                                        Academic Year
                                                    </Label>
                                                    <Input
                                                        id="year"
                                                        type="number"
                                                        value={updateForm.year}
                                                        onChange={(e) => setUpdateForm(prev => ({ ...prev, year: e.target.value }))}
                                                        className="h-11 border-[#e0e0e0] focus:border-[#9FE477]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="eligibilityCgpa" className="text-sm font-semibold text-[#252525]">
                                                        Minimum CGPA
                                                    </Label>
                                                    <Input
                                                        id="eligibilityCgpa"
                                                        type="number"
                                                        step="0.1"
                                                        value={updateForm.eligibilityCgpa}
                                                        onChange={(e) => setUpdateForm(prev => ({ ...prev, eligibilityCgpa: e.target.value }))}
                                                        className="h-11 border-[#e0e0e0] focus:border-[#9FE477]"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-semibold text-[#252525]">
                                                        Contact Phone
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        value={updateForm.phone}
                                                        onChange={(e) => setUpdateForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="h-11 border-[#e0e0e0] focus:border-[#9FE477]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {activeSection === 'schedule' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-[#252525]">Event Schedule</h3>
                                                    <Button
                                                        type="button"
                                                        onClick={addScheduleEvent}
                                                        className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" /> Add Event
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    {updateForm.schedule.map((event, index) => (
                                                        <Card key={index} className="border border-[#e0e0e0] bg-[#FAFAFA]">
                                                            <div
                                                                className="p-4 cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                                                                onClick={() => toggleScheduleExpansion(index)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Calendar className="w-5 h-5 text-[#9FE477]" />
                                                                        <div>
                                                                            <p className="font-medium text-[#252525]">
                                                                                {event.eventName || `Event ${index + 1}`}
                                                                            </p>
                                                                            {event.date && (
                                                                                <p className="text-sm text-[#616161]">
                                                                                    {formatDate(event.date)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeScheduleEvent(index);
                                                                            }}
                                                                            className="text-[#d32f2f] hover:text-[#b71c1c] hover:bg-[#ffebee]"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                        {expandedSchedule.includes(index) ?
                                                                            <ChevronUp className="w-5 h-5 text-[#616161]" /> :
                                                                            <ChevronDown className="w-5 h-5 text-[#616161]" />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {expandedSchedule.includes(index) && (
                                                                <div className="border-t border-[#e0e0e0] p-4 bg-[#f5f5f5] space-y-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-[#252525]">Event Name</Label>
                                                                        <Input
                                                                            placeholder="e.g., Pre-placement Talk"
                                                                            value={event.eventName}
                                                                            onChange={(e) => updateScheduleEvent(index, "eventName", e.target.value)}
                                                                            className="mt-1 border-[#e0e0e0] focus:border-[#9FE477]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-[#252525]">Date & Time</Label>
                                                                        <Input
                                                                            type="datetime-local"
                                                                            value={event.date}
                                                                            onChange={(e) => updateScheduleEvent(index, "date", e.target.value)}
                                                                            className="mt-1 border-[#e0e0e0] focus:border-[#9FE477]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-[#252525]">Description</Label>
                                                                        <Input
                                                                            placeholder="Optional description"
                                                                            value={event.description}
                                                                            onChange={(e) => updateScheduleEvent(index, "description", e.target.value)}
                                                                            className="mt-1 border-[#e0e0e0] focus:border-[#9FE477]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {activeSection === 'package' && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-[#252525]">Compensation Package</h3>
                                                        <p className="text-sm text-[#616161]">Total: {formatCurrency(
                                                            updateForm.package.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
                                                        )}</p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        onClick={addPackageComponent}
                                                        className="bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]"
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" /> Add Component
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    {updateForm.package.map((pkg, index) => (
                                                        <Card key={index} className="border border-[#e0e0e0] bg-[#FAFAFA]">
                                                            <div
                                                                className="p-4 cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                                                                onClick={() => togglePackageExpansion(index)}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <DollarSign className="w-5 h-5 text-[#9FE477]" />
                                                                        <div>
                                                                            <p className="font-medium text-[#252525]">
                                                                                {pkg.componentName || `Component ${index + 1}`}
                                                                            </p>
                                                                            <p className="text-sm text-[#616161]">
                                                                                {formatCurrency(parseFloat(pkg.amount) || 0)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removePackageComponent(index);
                                                                            }}
                                                                            className="text-[#d32f2f] hover:text-[#b71c1c] hover:bg-[#ffebee]"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                        {expandedPackage.includes(index) ?
                                                                            <ChevronUp className="w-5 h-5 text-[#616161]" /> :
                                                                            <ChevronDown className="w-5 h-5 text-[#616161]" />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {expandedPackage.includes(index) && (
                                                                <div className="border-t border-[#e0e0e0] p-4 bg-[#f5f5f5] space-y-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-[#252525]">Component Name</Label>
                                                                        <Input
                                                                            placeholder="e.g., Base Salary, Bonus, Stock Options"
                                                                            value={pkg.componentName}
                                                                            onChange={(e) => updatePackageComponent(index, "componentName", e.target.value)}
                                                                            className="mt-1 border-[#e0e0e0] focus:border-[#9FE477]"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-[#252525]">Amount (₹)</Label>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="Amount in INR"
                                                                            value={pkg.amount}
                                                                            onChange={(e) => updatePackageComponent(index, "amount", e.target.value)}
                                                                            className="mt-1 border-[#e0e0e0] focus:border-[#9FE477]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {updateMessage.text && (
                                            <div className={`p-3 rounded-lg flex items-center gap-2 ${updateMessage.isError
                                                ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]'
                                                : 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]'
                                                }`}>
                                                {updateMessage.isError ? (
                                                    <X className="w-4 h-4" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                <span className="text-sm font-medium">{updateMessage.text}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-4 pt-4 border-t border-[#e0e0e0]">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setUpdateModalOpen(false);
                                                    setSelectedCompany(null);
                                                    setUpdateMessage({ text: "", isError: false });
                                                }}
                                                className="w-full md:w-auto border-[#e0e0e0] text-[#616161] hover:bg-[#f5f5f5]"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="w-full md:w-auto bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Add Company Modal */}
                {addModalOpen && (
                    <div className="fixed inset-0 mt-0 z-50">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <Card className="bg-[#FAFAFA] border-0 w-full max-w-md p-6 rounded-2xl shadow-2xl">
                                <CardHeader className="p-4 pb-3 bg-[#9FE477]/20">
                                    <CardTitle className="flex items-center gap-3 text-xl text-[#252525]">
                                        <Plus className="w-5 h-5 text-[#9FE477]" />
                                        Add New Company
                                    </CardTitle>
                                    <CardDescription className="text-[#616161]">
                                        Upload a PDF with company details
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 space-y-6">
                                    <form onSubmit={handleAddSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="addFile" className="text-sm font-semibold text-[#252525]">
                                                Company PDF
                                            </Label>
                                            <Input
                                                id="addFile"
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) => setAddFile(e.target.files?.[0] || null)}
                                                className="mt-1 h-11 border-[#e0e0e0] focus:border-[#9FE477]"
                                            />
                                        </div>
                                        {addMessage.text && (
                                            <div className={`p-2 rounded-lg flex items-center gap-2 ${addMessage.isError
                                                ? 'bg-[#ffebee] text-[#d32f2f] border-[#ffcdd2]'
                                                : 'bg-[#e6f3e1] text-[#2f7d32] border-[#c8e6c9]'
                                                }`}>
                                                {addMessage.isError ? (
                                                    <X className="w-4 h-4" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                <span className="text-sm font-medium">{addMessage.text}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-end gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setAddModalOpen(false);
                                                    setAddFile(null);
                                                    setAddMessage({ text: "", isError: false });
                                                }}
                                                className="w-full md:w-auto border-[#e0e0e0] text-[#616161] hover:bg-[#f5f5f5]"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="w-full md:w-auto bg-[#9FE477] hover:bg-[#7AC142] text-[#252525]"
                                            >
                                                <Save className="w-4 h-4 mr-2" />
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Calendar Modal */}
                {calendarModalOpen && (
                    <div className="fixed inset-0 z-50">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center p-7">
                            <Card className="relative bg-[#FAFAFA] border-0 w-full max-w-7xl max-h-[90vh] overflow-y-auto p-5 rounded-2xl shadow-2xl overflow-hidden">

                                <CardHeader className="p-3 pb-2 bg-[#9FE477]/20">
                                    <CardTitle className="flex items-center gap-3 text-2xl text-[#252525]">
                                        <Calendar className="w-6 h-6 text-[#9FE477]" />
                                        Calendar Overview
                                    </CardTitle>
                                    <CardDescription className="text-[#616161]">
                                        View scheduled company events for the next 4 weeks
                                    </CardDescription>
                                    <button
                                        onClick={() => setCalendarModalOpen(false)}
                                        className="absolute top-5 right-7 text-[#252525] hover:text-[#7dcf59] transition"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </CardHeader>

                                <CardContent className="p-4 space-y-0">
                                    <div className="bg-transparent">
                                        <div className="flex items-center justify-between mb-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handlePreviousWeek}
                                                disabled={weekOffset === -maxOffset}
                                                className="text-[#9FE477] hover:bg-[#9FE477]/10"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </Button>
                                            <span className="text-base font-semibold text-[#252525]">{formatDateRange()}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleNextWeek}
                                                disabled={weekOffset === maxOffset}
                                                className="text-[#9FE477] hover:bg-[#9FE477]/10"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-7 text-center mb-2">
                                            {days.map(day => (
                                                <div key={day} className="font-bold text-[#616161]">{day.slice(0, 3)}</div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 grid-rows-4 gap-0">
                                            {getFourWeeksDays(weekOffset).map((day, index) => (
                                                <div
                                                    key={index}
                                                    className={`border p-2 h-28 overflow-y-auto rounded ${day.isPast ? 'bg-[#f5f5f5]' : 'bg-white'} ${day.hasEvents ? 'bg-[#e6f3e1]' : ''}`}
                                                >
                                                    <div className="text-sm text-[#757575] font-semibold">{day.date} {day.month}</div>
                                                    {day.interviews.map((interview, i) => (
                                                        <div key={i} className={`p-1 mt-1 text-xs rounded ${getStatusColor(interview.status)}`}>
                                                            {interview.company} ({interview.round})
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
};

export default AdminCompanies;