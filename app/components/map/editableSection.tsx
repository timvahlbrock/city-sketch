import DraggableLine from "@/app/components/map/draggableLine/draggableLine";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export interface SectionProps {
  sectionId: Id<"sections">;
  editable: boolean;
}

export async function EditableSection({ sectionId, editable }: SectionProps) {
  const rankedNodes = await fetchRankedNodes(sectionId);

  return (
    <DraggableLine
      serverNodes={rankedNodes}
      sectionId={sectionId}
      isEditable={editable}
    />
  );
}

function fetchRankedNodes(sectionId: Id<"sections">) {
  return fetchQuery(api.nodes.forSection, { sectionId });
}
