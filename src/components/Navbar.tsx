import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                    {/* Desktop Navigation */}
                    {!isAuthPage && (
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/companies" className="text-muted-foreground hover:text-foreground transition-colors">
                                Apply for Job
                            </Link>
                            <Link to="/placement-stats" className="text-muted-foreground hover:text-foreground transition-colors">
                                View Stats
                            </Link>
                        </nav>
                    )}

                    {/* Desktop Logout */}
                    {!isAuthPage && (
                        <div className="hidden md:flex items-center space-x-3">
                            <Link to="/login">
                                <Button size="sm" className="bg-primary rounded-2xl hover:opacity-90">
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    {!isAuthPage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && !isAuthPage && (
                <div className="md:hidden px-4 pb-4 pt-2 bg-background border-t border-border">
                    <nav className="flex flex-col space-y-3">
                        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link to="/companies" className="text-muted-foreground hover:text-foreground">
                            Apply for Job
                        </Link>
                        <Link to="/placement-stats" className="text-muted-foreground hover:text-foreground">
                            View Stats
                        </Link>
                        <Link to="/login">
                            <Button className="w-full bg-primary mt-3 hover:opacity-90">Logout</Button>
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
