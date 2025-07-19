import { Card } from "@/components/ui/card";
import { FileText, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const analyticsData = [
    {
        title: "Placement Analytics",
        growth: "+24.6%",
        bars: [40, 60, 45, 80, 65, 90, 75],
        stats: [
            { label: "Students Placed", icon: Users, value: "1,247" },
            { label: "Resumes Processed", icon: FileText, value: "3,456" },
        ],
        progress: 78,
    },
    {
        title: "Budget Overview",
        growth: "+18.2%",
        bars: [20, 35, 55, 45, 60, 50, 65],
        stats: [
            { label: "Marketing", icon: FileText, value: "$12,300" },
            { label: "Development", icon: FileText, value: "$24,650" },
        ],
        progress: 62,
    },
    {
        title: "User Engagement",
        growth: "+12.9%",
        bars: [10, 25, 30, 45, 35, 50, 60],
        stats: [
            { label: "Active Users", icon: Users, value: "8,230" },
            { label: "Sessions", icon: FileText, value: "15,000" },
        ],
        progress: 54,
    },
];

export function AnalyticsSwitcherCard() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % analyticsData.length);
        }, 3000); // Switch every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const data = analyticsData[index];

    return (
        <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-3xl rounded-full"></div>
            <Card className="relative p-6 shadow-elegant bg-card/50 backdrop-blur-sm border border-border/50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground">{data.title}</h3>
                            <div className="flex items-center space-x-2 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">{data.growth}</span>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg flex items-end justify-center p-4">
                            <div className="flex items-end space-x-2">
                                {data.bars.map((height, i) => (
                                    <div
                                        key={i}
                                        className="bg-gradient-primary rounded-t"
                                        style={{ height: `${height}%`, width: "12px" }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {data.stats.map((item, i) => (
                                <div key={i} className="bg-muted/50 rounded-lg p-3">
                                    <div className="flex items-center space-x-2">
                                        <item.icon className="w-4 h-4 text-accent" />
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                    </div>
                                    <div className="text-xl font-bold text-foreground mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Progress Indicator */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Goal Progress</span>
                                <span className="text-foreground font-medium">{data.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="bg-gradient-primary h-2 rounded-full"
                                    style={{ width: `${data.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
}
