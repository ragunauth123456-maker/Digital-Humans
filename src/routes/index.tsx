import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "~/components/HeroSection";
import ProblemSection from "~/components/ProblemSection";
import WhatIsSection from "~/components/WhatIsSection";
import HowItWorks from "~/components/HowItWorks";
import ExampleProfiles from "~/components/ExampleProfiles";
import TargetAudiences from "~/components/TargetAudiences";
import WaitlistForm from "~/components/WaitlistForm";
import Footer from "~/components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <WhatIsSection />
      <HowItWorks />
      <ExampleProfiles />
      <TargetAudiences />
      <WaitlistForm />
      <Footer />
    </>
  );
}
