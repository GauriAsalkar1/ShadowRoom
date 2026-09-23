import { LandingHeader } from "../components/landing/LandingHeader";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { MoodRooms } from "../components/landing/MoodRooms";
import { RealThoughts } from "../components/landing/RealThoughts";
import { PrivacySection } from "../components/landing/PrivacySection";
import { DiarySection } from "../components/landing/DiarySection";
import { QuoteSection } from "../components/landing/QuoteSection";
import { CTASection } from "../components/landing/CTASection";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <MoodRooms />
        <RealThoughts />
        <PrivacySection />
        <DiarySection />
        <QuoteSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}