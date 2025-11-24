import SectionTag from "./sectionTag";
import { Section } from "@/app/types/section";

export interface SectionsProps {
  serverSections: Section[];
}

export default function Sections({
  serverSections: serverSections,
}: SectionsProps) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {serverSections.map((section) => (
        <SectionTag key={section.id} section={section} />
      ))}
    </div>
  );
}
