import { AboutSection, Hero, SkillsSection } from "@/components/HomeSections";
import { PitWall } from "@/components/PitWall";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <PitWall />
    </>
  );
}
