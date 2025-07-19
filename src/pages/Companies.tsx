import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const companies = [
    {
        name: "Google",
        cgpa: 8.5,
        skills: ["React", "Node.js", "Data Structures"],
        package: "30 LPA",
        location: "Bangalore",
        deadline: "31st July 2025",
    },
    {
        name: "Microsoft",
        cgpa: 8.0,
        skills: ["C#", ".NET", "System Design"],
        package: "28 LPA",
        location: "Hyderabad",
        deadline: "25th July 2025",
    },
    {
        name: "Infosys",
        cgpa: 6.5,
        skills: ["Java", "MySQL", "Spring Boot"],
        package: "6 LPA",
        location: "Pune",
        deadline: "30th July 2025",
    },
];

const ApplyJobs = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center" style={{ color: "#9FE477" }}>
                    Explore Job Opportunities
                </h1>

                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company, idx) => (
                        <Card
                            key={idx}
                            className="rounded-2xl border border-gray-200 shadow-md transition-all duration-200 bg-white"
                            style={{ boxShadow: "0 4px 20px rgba(159, 228, 119, 0.3)" }} // green shadow
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
                                    {company.cgpa}
                                </div>

                                <div className="text-sm">
                                    <span className="font-semibold text-gray-600">Package: </span>
                                    {company.package}
                                </div>

                                <div className="text-sm">
                                    <span className="font-semibold text-gray-600">Deadline: </span>
                                    {company.deadline}
                                </div>

                                <div className="text-sm">
                                    <span className="font-semibold text-gray-600">Skills Required: </span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {company.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                style={{
                                                    backgroundColor: "#E9FCE1", // light green background
                                                    color: "#5D9930", // darker text
                                                }}
                                                className="px-2 py-1 text-xs rounded-full"
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    className="w-full text-white mt-4"
                                    style={{
                                        backgroundColor: "#9FE477",
                                        color: "#1B1B1B",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#8BD65C")}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#9FE477")}
                                >
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApplyJobs;