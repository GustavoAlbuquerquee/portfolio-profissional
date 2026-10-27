import { AboutSection, Hero, SkillsSection } from "@/components/HomeSections";
import { CommitTicker } from "@/components/CommitTicker";
import { PitWall } from "@/components/PitWall";
import { CodeTelemetry } from "@/components/CodeTelemetry";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CommitTicker />
      <AboutSection />
      <SkillsSection />
      <CodeTelemetry />
      <PitWall />
    </>
  );
}
