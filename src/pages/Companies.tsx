import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get("http://localhost:8000/company/getAllCompanies", {
                withCredentials: true
            });
            setCompanies(res.data.data.companies);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const fetchUserApplications = async () => {
        try {
            const res = await axios.get("http://localhost:8000/application/getAllApplicationsByUser", {
                withCredentials: true
            });
            console.log(res.data);
            setUserApplications(res.data.applications || []);
        } catch (error) {
            console.error("Error fetching user applications:", error);
        }
    };

    useEffect(() => {
        fetchCompanies();
        fetchUserApplications();
    }, []);

    const isDeadlinePassed = (deadline) => {
        return deadline ? dayjs(deadline).isBefore(dayjs()) : false;
    };

    const hasApplied = (companyId) => {
        return userApplications.some((app) => app.companyId === companyId);
    };

    const getButtonText = (expired, applied) => {
        if (expired) return "Deadline Passed";
        if (applied) return "Already Applied";
        return "Apply";
    };

    const handleApplyClick = (company) => {
        setSelectedCompany(company);
        setModalMessage("");
        setIsError(false);
    };

    const handleApplyConfirm = async () => {
        if (!selectedCompany) return;

        try {
            const res = await axios.post(
                `http://localhost:8000/application/apply/${selectedCompany._id}`,
                {},
                { withCredentials: true }
            );
            setModalMessage(res.data.message || "Application submitted successfully!");
            setIsError(false);
            await fetchUserApplications();
            setTimeout(() => setSelectedCompany(null), 2000);
        } catch (error) {
            setModalMessage(
                error.response?.data?.message || "Failed to submit application."
            );
            setIsError(true);
        }
    };

    const closeModal = () => {
        setSelectedCompany(null);
        setModalMessage("");
        setIsError(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Company Listings</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => {
                    const expired = isDeadlinePassed(company.deadline);
                    const applied = hasApplied(company._id);

                    return (
                        <div
                            key={company._id}
                            className={`rounded-2xl shadow-md p-5 border transition duration-300 ${expired || applied
                                    ? "bg-gray-300 text-gray-500 pointer-events-none opacity-60"
                                    : "bg-white hover:shadow-lg"
                                }`}
                        >
                            <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                            <p className="text-sm mb-2 text-gray-700">
                                CTC: ₹
                                {company.package
                                    .reduce((acc, p) => acc + p.amount, 0)
                                    .toLocaleString()}
                            </p>
                            <p className="text-sm mb-2 text-gray-700">
                                Eligibility CGPA: {company.eligibilityCgpa}
                            </p>
                            <p className="text-sm mb-2 text-gray-700">Email: {company.email}</p>
                            <p className="text-sm mb-2 text-gray-700">Phone: {company.phone}</p>
                            <p className="text-sm mb-2 text-gray-700">Year: {company.year}</p>
                            <p className="text-sm mb-3 text-gray-700">
                                Deadline:{" "}
                                {company.deadline
                                    ? dayjs(company.deadline).format("MMM D, YYYY h:mm A")
                                    : "Not set"}
                            </p>

                            <div className="mt-4">
                                <h3 className="text-md font-medium mb-2">Schedule:</h3>
                                <ul className="space-y-2">
                                    {company.schedule.map((event) => (
                                        <li key={event._id}>
                                            <div className="text-sm">
                                                <span className="font-semibold">{event.eventName}</span>:{" "}
                                                {dayjs(event.date).format("MMM D, YYYY h:mm A")}
                                                <div className="text-xs text-gray-600">
                                                    {event.description}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-md font-medium mb-2">Package Breakdown:</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    {company.package.map((p) => (
                                        <li key={p._id}>
                                            <span className="capitalize">{p.componentName}</span>: ₹
                                            {p.amount.toLocaleString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => handleApplyClick(company)}
                                    disabled={expired || applied}
                                    className={`px-4 py-2 rounded-lg font-medium ${expired || applied
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    {getButtonText(expired, applied)}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">
                            Apply to {selectedCompany.name}
                        </h2>
                        <p className="text-sm mb-2">
                            <strong>CTC:</strong> ₹
                            {selectedCompany.package
                                .reduce((acc, p) => acc + p.amount, 0)
                                .toLocaleString()}
                        </p>
                        <p className="text-sm mb-2">
                            <strong>Eligibility CGPA:</strong> {selectedCompany.eligibilityCgpa}
                        </p>
                        <p className="text-sm mb-4">
                            <strong>Deadline:</strong>{" "}
                            {selectedCompany.deadline
                                ? dayjs(selectedCompany.deadline).format("MMM D, YYYY h:mm A")
                                : "Not set"}
                        </p>
                        {modalMessage && (
                            <p
                                className={`text-sm mb-4 ${isError ? "text-red-500" : "text-green-500"
                                    }`}
                            >
                                {modalMessage}
                            </p>
                        )}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyConfirm}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Confirm Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Companies;