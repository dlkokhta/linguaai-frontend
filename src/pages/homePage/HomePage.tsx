import { HomeNav } from "./components/HomeNav";
import { HeroSection } from "./components/HeroSection";
import { HowItWorks } from "./components/HowItWorks";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { CTABanner } from "./components/CTABanner";
import { HomeFooter } from "./components/HomeFooter";

export const Homepage = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 overflow-hidden">
    <HomeNav />
    <HeroSection />
    <HowItWorks />
    <FeaturesGrid />
    <CTABanner />
    <HomeFooter />
  </div>
);
