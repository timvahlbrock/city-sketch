"use client";

import { ClientSectionsProps } from "@/app/vision/[visionId]/edit/clientSections";
import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";
import { EditableClientSection } from "@/app/components/map/editableClientSection";

export default function ClientSections({
  serverSections: serverSections,
}: ClientSectionsProps) {
  serverSections = serverSections ?? [];

  const { addedSections, removedSections } = useContext(EditorContext);

  const combinedSections = serverSections
    ?.concat(Array.from(addedSections.values()))
    .filter((section) => !removedSections.has(section.id));

  return combinedSections.map((section) => (
    <EditableClientSection
      key={section.id}
      sectionId={section.id}
      editable={true}
    />
  ));
}
