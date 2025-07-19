import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Check
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    deadline: string | Date; // Allow string or Date for flexibility
}

const AdminCompanies = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
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
    const [packageModalStates, setPackageModalStates] = useState<{ [key: string]: boolean }>({}); // Track modal state per company

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8000/company/getAllCompanies", {
                withCredentials: true,
            });
            const companies = response.data.data.companies || [];
            const sortedCompanies = [...companies].sort((a, b) => {
                const now = new Date("2025-07-19T16:27:00Z"); // 09:57 PM IST
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
            phone: company.phone || "", // Ensure phone is a string
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

        try {
            const updates = {
                name: updateForm.name.trim(),
                year: parseInt(updateForm.year),
                eligibilityCgpa: parseFloat(updateForm.eligibilityCgpa),
                phone: updateForm.phone.trim(), // Ensure trim works on string
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
                `http://localhost:8000/company/update-company/${selectedCompany._id}`,
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
                "http://localhost:8000/company/add-company", // Corrected endpoint
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
        return isNaN(date.getTime()) ? false : date > new Date(); // 09:57 PM IST
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Manage Companies
                        </h1>
                        <p className="text-slate-600 mt-1">View, add, and update company details</p>
                    </div>
                    <Button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg w-full md:w-auto"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add Company
                    </Button>
                </div>

                {/* Error or Loading Message */}
                {(error || loading) && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
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
                            className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-blue-50/30 hover:from-blue-50/50 hover:to-indigo-50/50"`}
                        >
                            <CardHeader className="p-6 pb-4">
                                <CardTitle className="flex items-center gap-3 text-xl text-slate-800">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    {company.name}
                                </CardTitle>
                                <CardDescription className="text-slate-600">Company placement details</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-slate-800">CTC</p>
                                            <p>{formatCurrency(company.package.reduce((acc, p) => acc + p.amount, 0))}</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => togglePackageModal(company._id)}
                                                className="p-1 h-auto text-blue-600 hover:text-blue-800"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <GraduationCap className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-slate-800">Min CGPA</p>
                                            <p>{company.eligibilityCgpa}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="truncate">{company.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{company.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <CalendarDays className="w-4 h-4" />
                                        <span>Year {company.year}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-slate-800">Application Deadline</h4>
                                    </div>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(company.deadline)}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-800 mb-2">Upcoming Events</h4>
                                    <div className="space-y-1 max-h-20 overflow-y-auto">
                                        {company.schedule.slice(0, 2).map((event) => (
                                            <div key={event._id} className="text-xs p-2 bg-blue-50 rounded">
                                                <p className="font-medium text-blue-800">{event.eventName}</p>
                                                <p className="text-blue-600">{formatDate(event.date)}</p>
                                            </div>
                                        ))}
                                        {company.schedule.length > 2 && (
                                            <p className="text-xs text-slate-500">+{company.schedule.length - 2} more events</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleUpdateClick(company)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Edit className="w-4 h-4 mr-2" /> Edit Company
                                </Button>
                                <Button
                                    // disabled={isCompleted(company.schedule[company.schedule.length - 1].date)}
                                    onClick={() => { navigate(`/accept-admin/${company._id}`) }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Check className="w-4 h-4 mr-2" /> {isCompleted(company.schedule[company.schedule.length - 1].date) ? "Ongoing" : "Finalize Students"}
                                </Button>
                            </CardContent>

                            {/* Package Split Modal */}
                            {packageModalStates[company._id] && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <Card className="bg-white border-0 w-full max-w-sm p-6 rounded-2xl shadow-2xl">
                                        <CardHeader className="p-4 pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <DollarSign className="w-5 h-5" />
                                                Package Split for {company.name}
                                            </CardTitle>
                                            <CardDescription className="text-blue-100">
                                                Breakdown of compensation components
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-3">
                                            {company.package.map((pkg, index) => (
                                                <div key={index} className="flex justify-between text-sm text-slate-700">
                                                    <span>{pkg.componentName}</span>
                                                    <span>{formatCurrency(pkg.amount)}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-end gap-4 pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => togglePackageModal(company._id)}
                                                    className="w-full md:w-auto"
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="bg-white border-0 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl rounded-2xl">
                            <CardHeader className="p-6 pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <Edit className="w-6 h-6" />
                                    Update {selectedCompany.name}
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    Modify company placement details
                                </CardDescription>
                            </CardHeader>

                            <div className="flex border-b bg-slate-50">
                                {(['basic', 'schedule', 'package'] as const).map((section) => (
                                    <button
                                        key={section}
                                        onClick={() => setActiveSection(section)}
                                        className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${activeSection === section
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                            : 'text-slate-600 hover:text-slate-800'
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
                                                <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                                                    Company Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    value={updateForm.name}
                                                    onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="year" className="text-sm font-semibold text-slate-700">
                                                    Academic Year
                                                </Label>
                                                <Input
                                                    id="year"
                                                    type="number"
                                                    value={updateForm.year}
                                                    onChange={(e) => setUpdateForm(prev => ({ ...prev, year: e.target.value }))}
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="eligibilityCgpa" className="text-sm font-semibold text-slate-700">
                                                    Minimum CGPA
                                                </Label>
                                                <Input
                                                    id="eligibilityCgpa"
                                                    type="number"
                                                    step="0.1"
                                                    value={updateForm.eligibilityCgpa}
                                                    onChange={(e) => setUpdateForm(prev => ({ ...prev, eligibilityCgpa: e.target.value }))}
                                                    className="h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                                                    Contact Phone
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    value={updateForm.phone}
                                                    onChange={(e) => setUpdateForm(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="h-11"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeSection === 'schedule' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-slate-800">Event Schedule</h3>
                                                <Button
                                                    type="button"
                                                    onClick={addScheduleEvent}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Event
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {updateForm.schedule.map((event, index) => (
                                                    <Card key={index} className="border border-slate-200">
                                                        <div
                                                            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                                            onClick={() => toggleScheduleExpansion(index)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                                    <div>
                                                                        <p className="font-medium text-slate-800">
                                                                            {event.eventName || `Event ${index + 1}`}
                                                                        </p>
                                                                        {event.date && (
                                                                            <p className="text-sm text-slate-600">
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
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                    {expandedSchedule.includes(index) ?
                                                                        <ChevronUp className="w-5 h-5 text-slate-400" /> :
                                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {expandedSchedule.includes(index) && (
                                                            <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium text-slate-700">Event Name</Label>
                                                                    <Input
                                                                        placeholder="e.g., Pre-placement Talk"
                                                                        value={event.eventName}
                                                                        onChange={(e) => updateScheduleEvent(index, "eventName", e.target.value)}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm font-medium text-slate-700">Date & Time</Label>
                                                                    <Input
                                                                        type="datetime-local"
                                                                        value={event.date}
                                                                        onChange={(e) => updateScheduleEvent(index, "date", e.target.value)}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm font-medium text-slate-700">Description</Label>
                                                                    <Input
                                                                        placeholder="Optional description"
                                                                        value={event.description}
                                                                        onChange={(e) => updateScheduleEvent(index, "description", e.target.value)}
                                                                        className="mt-1"
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
                                                    <h3 className="text-lg font-semibold text-slate-800">Compensation Package</h3>
                                                    <p className="text-sm text-slate-600">Total: {formatCurrency(
                                                        updateForm.package.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
                                                    )}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={addPackageComponent}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Component
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {updateForm.package.map((pkg, index) => (
                                                    <Card key={index} className="border border-slate-200">
                                                        <div
                                                            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                                            onClick={() => togglePackageExpansion(index)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <DollarSign className="w-5 h-5 text-green-600" />
                                                                    <div>
                                                                        <p className="font-medium text-slate-800">
                                                                            {pkg.componentName || `Component ${index + 1}`}
                                                                        </p>
                                                                        <p className="text-sm text-slate-600">
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
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                    {expandedPackage.includes(index) ?
                                                                        <ChevronUp className="w-5 h-5 text-slate-400" /> :
                                                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {expandedPackage.includes(index) && (
                                                            <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium text-slate-700">Component Name</Label>
                                                                    <Input
                                                                        placeholder="e.g., Base Salary, Bonus, Stock Options"
                                                                        value={pkg.componentName}
                                                                        onChange={(e) => updatePackageComponent(index, "componentName", e.target.value)}
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm font-medium text-slate-700">Amount (₹)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Amount in INR"
                                                                        value={pkg.amount}
                                                                        onChange={(e) => updatePackageComponent(index, "amount", e.target.value)}
                                                                        className="mt-1"
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
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
                                            }`}>
                                            {updateMessage.isError ? (
                                                <X className="w-4 h-4" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            <span className="text-sm font-medium">{updateMessage.text}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-4 pt-4 border-t">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setUpdateModalOpen(false);
                                                setSelectedCompany(null);
                                                setUpdateMessage({ text: "", isError: false });
                                            }}
                                            className="w-full md:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add Company Modal */}
                {addModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <Card className="bg-white border-0 w-full max-w-md p-6 rounded-2xl shadow-2xl">
                            <CardHeader className="p-4 pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <Plus className="w-5 h-5" />
                                    Add New Company
                                </CardTitle>
                                <CardDescription className="text-blue-100">
                                    Upload a PDF with company details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 space-y-6">
                                <form onSubmit={handleAddSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="addFile" className="text-sm font-semibold text-slate-700">
                                            Company PDF
                                        </Label>
                                        <Input
                                            id="addFile"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setAddFile(e.target.files?.[0] || null)}
                                            className="mt-1 h-11"
                                        />
                                    </div>
                                    {addMessage.text && (
                                        <div className={`p-2 rounded-lg flex items-center gap-2 ${addMessage.isError
                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                            : 'bg-green-50 text-green-700 border border-green-200'
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
                                            className="w-full md:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCompanies;