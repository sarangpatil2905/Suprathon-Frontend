import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Users,
  Search,
  Target
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "OCR Resume Processing",
      description: "Automatically extract and digitize resume data with 95% accuracy using advanced OCR technology.",
      badge: "AI Powered",
      color: "text-[#9FE476]"
    },
    {
      icon: Brain,
      title: "Smart Skill Tagging",
      description: "Intelligent auto-tagging system identifies and categorizes skills from resumes for better matching.",
      badge: "Machine Learning",
      color: "text-[#9FE476]"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive placement statistics, recruiter insights, and performance dashboards.",
      badge: "Real-time",
      color: "text-[#9FE476]"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Separate portals for TPOs and students with role-based permissions and customized views.",
      badge: "Secure",
      color: "text-[#9FE476]"
    },
    {
      icon: Search,
      title: "Eligibility Filters",
      description: "Advanced filtering system to match students with relevant opportunities based on criteria.",
      badge: "Smart Matching",
      color: "text-[#9FE476]"
    },
    {
      icon: Target,
      title: "Recruiter Management",
      description: "Track top recruiters, manage company profiles, and maintain placement relationships.",
      badge: "CRM Integrated",
      color: "text-[#9FE476]"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Core Features
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Here's How We Are Different From Others
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive automation and intelligence features designed specifically for educational institutions and placement management.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 border border-border/50 hover:border-border">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-muted/50 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-accent" />
            <span>Automated processes save 10+ hours per week for TPO teams</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;