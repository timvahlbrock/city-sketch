"use client";

import { useParams } from "next/navigation";
import { useSections } from "@/app/hooks/sections";
import { Section } from "@/app/components/map/section";

export default function Page() {
  const { visionId } = useParams();
  const sections = useSections(parseInt(visionId as string, 10));

  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} sectionId={section.id} />
      ))}
    </>
  );
}
