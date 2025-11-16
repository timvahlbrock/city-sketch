"use client";

import { ClientSectionsProps } from "@/app/vision/[visionId]/edit/clientSections";
import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";
import { EditableClientSection } from "@/app/components/map/editableClientSection";

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

  return combinedSections.map((section) => (
    <EditableClientSection
      key={section.id}
      sectionId={section.id}
      editable={true}
    />
  ));
}
