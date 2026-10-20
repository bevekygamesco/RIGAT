import { ScrollStory } from "@/components/home/ScrollStory";
import { Craftsmanship } from "@/components/home/Craftsmanship";
import { SignatureStrip } from "@/components/home/SignatureStrip";
import { Expertise } from "@/components/home/Expertise";
import { ProjectProcess } from "@/components/home/ProjectProcess";
import { FAQ } from "@/components/home/FAQ";
import { ClosingCTA } from "@/components/home/ClosingCTA";

export default function HomePage() {
  return (
    <>
      <ScrollStory />
      <Craftsmanship />
      <SignatureStrip />
      <Expertise />
      <ProjectProcess />
      <FAQ />
      <ClosingCTA />
    </>
  );
}
