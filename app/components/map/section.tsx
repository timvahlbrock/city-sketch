import DraggableLine from "@/app/components/map/draggableLine";
import { createSsrClient } from "@/app/utils/createSsrClient";

export interface SectionProps {
  sectionId: number;
}

export async function Section({ sectionId }: SectionProps) {
  const rankedNodes = await fetchRankedNodes(sectionId);
  return <DraggableLine initialNodes={rankedNodes} dataId={sectionId} />;
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
