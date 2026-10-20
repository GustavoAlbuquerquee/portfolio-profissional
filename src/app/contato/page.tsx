import type { Metadata } from "next";
import { ContactView } from "./ContactView";

export const metadata: Metadata = {
  title: "Contato",
  description: "Canais diretos de contato e formulário com envio de e-mail.",
};

export default function ContactPage() {
  return <ContactView />;
}
