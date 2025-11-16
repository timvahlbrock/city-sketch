import { createSsrClient } from "@/app/utils/createSsrClient";
import DraggableLine from "@/app/components/map/draggableLine";

export interface SectionProps {
  sectionId: number;
  editable: boolean;
}

export async function EditableSection({ sectionId, editable }: SectionProps) {
  const rankedNodes = await fetchRankedNodes(sectionId);
  return (
    <DraggableLine
      initialNodes={rankedNodes}
      dataId={sectionId}
      isEditable={editable}
    />
  );
}

async function fetchRankedNodes(sectionId: number) {
  const client = await createSsrClient();
  const sectionToNodes = await client
    .from("sectionsToNodes")
    .select("rank, nodes(id, latitude, longitude)")
    .eq("sectionId", sectionId)
    .order("rank")
    .throwOnError();

  return sectionToNodes.data.map((entry) => ({
    id: entry.nodes.id,
    latitude: entry.nodes.latitude,
    longitude: entry.nodes.longitude,
    rank: entry.rank,
  }));
}
