import type { Metadata } from "next";
import { ProjectsView } from "./ProjectsView";

export const metadata: Metadata = {
  title: "Projetos",
  description: "Linha do tempo dos projetos desenvolvidos, do mais antigo ao mais recente.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
