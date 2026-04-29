import React, { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import FutureFocusSection from "../components/landing/FutureFocusSection";
import AdvisorsSection from "../components/landing/AdvisorsSection";
import TimelineSection from "../components/landing/TimelineSection";
import ProjectsAwardsSection from "../components/landing/ProjectsAwardsSection";
import GlobalVisionSection from "../components/landing/GlobalVisionSection";
import CultureSection from "../components/landing/CultureSection";
import CallToActionFooter from "../components/landing/CallToActionFooter";
import Footer from "../components/Footer";

const LandingPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main>
        <HeroSection />

        {/* Prominent focus area right below Hero */}
        <FutureFocusSection />

        <AdvisorsSection />

        <TimelineSection />

        <ProjectsAwardsSection />

        <GlobalVisionSection />

        <CultureSection />

        <CallToActionFooter />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
