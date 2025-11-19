"use client";

import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";
import SectionTag from "./sectionTag";
import { Section } from "@/app/contexts/editor/editorState";

export interface ClientSectionsProps {
  serverSections?: Section[];
}

export default function ClientSections({
  serverSections: serverSections,
}: ClientSectionsProps) {
  serverSections = serverSections ?? [];
  const clientSections = useContext(EditorContext).addedSections;

  const unsyncedSections = new Map(clientSections);

  serverSections?.forEach((serverSection) => {
    unsyncedSections.delete(serverSection.id);
  });

  const combinedSections = serverSections?.concat(
    Array.from(unsyncedSections.values()),
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {combinedSections.map((section) => (
        <SectionTag key={section.id} section={section} />
      ))}
    </div>
  );
}
