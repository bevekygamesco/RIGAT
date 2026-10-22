import type { Metadata } from "next";
import Configurator from "@/components/configurator";

export const metadata: Metadata = {
  title: "Configurateur 3D",
  alternates: {canonical: "/configurateur-3d/"},
  robots: {index:false,follow:true},
};

export default function ConfiguratorPage() {
  return <Configurator />;
}
