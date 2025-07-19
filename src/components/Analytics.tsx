import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Building2, Star } from "lucide-react";

const Analytics = () => {
  return (
    <section id="analytics" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-">
          {/* Left Content */}
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-4">
                Data Analytics
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Single Dashboard, Multi Benefits
              </h2>
              <p className="text-lg text-muted-foreground">
                Drive placement success with comprehensive analytics. Get insights into placement trends, top recruiters, and student performance metrics all in one powerful dashboard.
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3 space-y-3">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Placement Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor placement progress with live updates and automated notifications.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Recruiter Performance Insights</h3>
                  <p className="text-sm text-muted-foreground">Identify top recruiters and optimize partnership strategies.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center mt-0.5">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Predictive Analytics</h3>
                  <p className="text-sm text-muted-foreground">Forecast placement trends and prepare strategic initiatives.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Analytics Cards */}
          <div className="space-y-6">
            {/* Main Analytics Card */}
            <Card className="shadow-card border border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Placement Analytics</CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +26.4%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-foreground">2,847</div>
                <div className="text-sm text-muted-foreground">Total Placements This Year</div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">CS Department</span>
                      <span className="text-foreground font-medium">89%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">ECE Department</span>
                      <span className="text-foreground font-medium">76%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center border border-border/50">
                <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">94%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </Card>
              <Card className="p-4 text-center border border-border/50">
                <Building2 className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">156</div>
                <div className="text-xs text-muted-foreground">Partner Companies</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Company Logos Carousel - Infinite Loop */}
        <div className="overflow-hidden mt-4 pt-12">
          <div className="flex animate-scroll space-x-8 w-max">
            {[
              "spotify.png",
              "google.png",
              "microsoft.png",
              "webflow.png",
              "dribble.png",
              "nvidia.png",
              "quantumai.png",
              "pixelworks.png",
            ].map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-6 py-2 "
              >
                <img
                  src={`/logos/${logo}`}
                  alt={logo.replace(".png", "")}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}

            {/* Duplicate logos for seamless infinite scroll */}
            {[
              "spotify.png",
              "google.png",
              "microsoft.png",
              "webflow.png",
              "dribble.png",
              "nvidia.png",
              "quantumai.png",
              "pixelworks.png",
            ].map((logo, idx) => (
              <div
                key={`copy-${idx}`}
                className="flex items-center justify-center px-6 py-2 "
              >
                <img
                  src={`/logos/${logo}`}
                  alt={logo.replace(".png", "")}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Analytics;