import { AboutSection, Hero, SkillsSection } from "@/components/HomeSections";
import { PitWall } from "@/components/PitWall";
import { CodeTelemetry } from "@/components/CodeTelemetry";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <PitWall />
      <CodeTelemetry />
    </>
  );
}
