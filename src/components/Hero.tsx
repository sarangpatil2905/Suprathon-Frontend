import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalyticsSwitcherCard } from './AnalyticsSwitcherCard';
import { ArrowRight, TrendingUp, Users, FileText, BarChart3, Zap, Clock } from "lucide-react";


const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-20 lg:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Automated Placement Management
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Smart Solution For Your Placement Needs
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Streamline placement processes with automated record management, OCR-powered resume extraction, and comprehensive analytics for enhanced decision making.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:opacity-90 ">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-10 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">10x</div>
                <div className="text-sm text-muted-foreground">Faster Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Colleges Trust Us</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <AnalyticsSwitcherCard />
        </div>
      </div>

    </section >
  );
};

export default Hero;