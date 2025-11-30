"use client";

import DraggableLine from "@/app/@map/components/draggableLine/draggableLine";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export interface SectionProps {
  sectionId: Id<"sections">;
  editable: boolean;
}

export function EditableSection({ sectionId, editable }: SectionProps) {
  const rankedNodes = useQuery(api.nodes.forSection, { sectionId }) || [];

  return (
    <DraggableLine
      serverNodes={rankedNodes}
      sectionId={sectionId}
      isEditable={editable}
    />
  );
}
