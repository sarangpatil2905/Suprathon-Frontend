import { Button } from "@/components/ui/button";
import { GraduationCap, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#9FE477]" />
            </div>
            <Link to="/">
              <span className="text-xl font-bold text-foreground">PlacementPro</span>
            </Link>

          </div>

          {/* Navigation */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>
          )}

          {/* CTA Buttons */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-3">

              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-2xl">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-primary rounded-2xl hover:opacity-90">
                  SignUp
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          {!isAuthPage && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
