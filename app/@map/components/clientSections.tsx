"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EditableSection } from "@/app/@map/components/editableSection";

export interface ClientSectionsProps {
  preloadedSections: Preloaded<typeof api.sections.forVision>;
  editable?: boolean;
}

export default function ClientSections({
  preloadedSections,
  editable,
}: ClientSectionsProps) {
  const sections = usePreloadedQuery(preloadedSections);

  return sections.map((section) => (
    <EditableSection
      key={section._id}
      sectionId={section._id}
      editable={editable ?? false}
    />
  ));
}
