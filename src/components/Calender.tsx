import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // Required default styles
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/calendar-custom.css"; // We'll customize this below

const events = [
    {
        date: "2025-07-20",
        label: "Google Interview",
        icon: "💻",
        color: "bg-blue-100 border-blue-300"
    },
    {
        date: "2025-07-22",
        label: "Microsoft HR",
        icon: "🧑‍💼",
        color: "bg-green-100 border-green-300"
    },
    {
        date: "2025-07-24",
        label: "Amazon Round 2",
        icon: "📦",
        color: "bg-yellow-100 border-yellow-300"
    }
];

const InterviewCalendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date | [Date, Date]>(new Date());
    const getEventForDate = (date: Date) => {
        const dateStr = date.toISOString().split("T")[0];
        return events.filter(event => event.date === dateStr);
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">📅 Interview Calendar</h2>
                <button className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600">
                    + Add Event
                </button>
            </div>
            <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date }) => {
                    const hasEvent = getEventForDate(date).length > 0;
                    return hasEvent ? "has-event" : "";
                }}
                tileContent={({ date }) => {
                    const items = getEventForDate(date);
                    return (
                        <div className="flex flex-col gap-1 mt-1">
                            {items.map((e, i) => (
                                <div
                                    key={i}
                                    className={`text-xs px-1 rounded-md border ${e.color} flex items-center gap-1`}
                                >
                                    <span>{e.icon}</span>
                                    <span className="truncate">{e.label.split(" ")[0]}</span>
                                </div>
                            ))}
                        </div>
                    );
                }}
                prevLabel={<ChevronLeft className="w-4 h-4 text-gray-500" />}
                nextLabel={<ChevronRight className="w-4 h-4 text-gray-500" />}
                className="custom-calendar"
            />
        </div>
    );
};

export default InterviewCalendar;
