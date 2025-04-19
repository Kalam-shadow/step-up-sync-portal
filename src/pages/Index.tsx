
import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import BatchesSection from "@/components/BatchesSection";
import TrainersSection from "@/components/TrainersSection";
import RegisterSection from "@/components/RegisterSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <IntroSection />
      <BatchesSection />
      <TrainersSection />
      <RegisterSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
