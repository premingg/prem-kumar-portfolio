import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WhatIOfferSection from "@/components/WhatIOfferSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import GitHubSection from "@/components/GitHubSection";
import ContactFormSection from "@/components/ContactFormSection";
import ConnectSection from "@/components/ConnectSection";
import SecretAdminModal from "@/components/SecretAdminModal";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageView } from "@/hooks/usePageView";
import { initLenis } from "@/lib/lenis";

const Index = () => {
  const [appReady, setAppReady] = useState(false);
  usePageView("/");

  useEffect(() => {
    if (appReady) initLenis();
  }, [appReady]);

  const handleLoadingDone = () => {
    setAppReady(true);
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #0b0b0f 0%, #141419 100%)" }}
    >

      {/* Loading screen sits on top until done */}
      <AnimatePresence>
        {!appReady && (
          <LoadingScreen onDone={handleLoadingDone} />
        )}
      </AnimatePresence>

      {appReady && (
        <>
          <Navbar />
          <SecretAdminModal />
          <HeroSection />
          <AboutSection />
          <WhatIOfferSection />
          <TechStackSection />
          <ProjectsSection />
          <ExperienceSection />
          <GitHubSection />
          <ContactFormSection />
          <ConnectSection />
        </>
      )}
    </div>
  );
};

export default Index;
