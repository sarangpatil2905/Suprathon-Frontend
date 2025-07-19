import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div className="w-[80%] h-[2px] bg-border/60 rounded mx-auto" />
      <Features />
      <div className="w-[80%] h-[2px] bg-border/60 rounded mx-auto" />
      <Analytics />
      <div className="w-[80%] h-[2px] bg-border/60 rounded mx-auto" />
      <Footer />
    </div>
  );
};

export default Index;
