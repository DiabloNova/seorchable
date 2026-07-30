import React from "react";
import { LandingHeader } from "@/components/marketing/LandingHeader";
import { HeroSection } from "@/components/marketing/HeroSection";
import { PlatformsSection } from "@/components/marketing/PlatformsSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { MetricsSection } from "@/components/marketing/MetricsSection";
import { ProcessSection } from "@/components/marketing/ProcessSection";
import { CTASection } from "@/components/marketing/CTASection";
import { LandingFooter } from "@/components/marketing/LandingFooter";

/**
 * Localized, RTL-aware marketing landing page composed of layered
 * glassmorphic / neumorphic sections with an authentication-aware hero.
 */
export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <PlatformsSection />
        <FeaturesSection />
        <MetricsSection />
        <ProcessSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
