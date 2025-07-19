import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  const isPositiveTrend = trend?.startsWith("+");
  const isNewTrend = trend === "New!";

  return (
    <Card className={cn(
      " bg-white/40 border-border/80 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-[1.02]",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <p className={cn(
                "text-xs font-medium flex items-center gap-1",
                isPositiveTrend ? "text-success" : isNewTrend ? "text-primary" : "text-muted-foreground"
              )}>
                {trend}
                {!isNewTrend && (
                  <span className="text-muted-foreground">vs last month</span>
                )}
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};