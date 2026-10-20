import type { Metadata } from "next";
import { ExperiencesView } from "./ExperiencesView";

export const metadata: Metadata = {
  title: "Experiências",
  description:
    "Experiências profissionais, estágios, freelas, projetos open source e eventos técnicos.",
};

export default function ExperiencesPage() {
  return <ExperiencesView />;
}
