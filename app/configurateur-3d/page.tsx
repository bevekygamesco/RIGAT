import "@/styles/rigat-configurator-page.css";
import type { Metadata } from "next";
import Configurator from "@/components/configurator";

export const metadata: Metadata = {
  title: "Configurateur 3D",
  alternates: { canonical: "/configurateur-3d/" },
  description:
    "Configurez votre rideau métallique RIGAT : rotation par images, ouverture et fermeture, mesures, profils de coffre, finitions et récapitulatif.",
  robots: { index: true, follow: true },
};

export default function ConfiguratorPage() {
  return <Configurator />;
}
