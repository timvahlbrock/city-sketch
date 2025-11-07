import { useEffect, useState } from "react";
import { createFrontendClient } from "@/app/createFrontendClient";

export interface RankedNode {
  id: number;
  latitude: number;
  longitude: number;
  rank: number;
}

export function useRankedNodes(sectionId: number) {
  const [rankedNodes, setRankedNodes] = useState<RankedNode[]>([]);

  useEffect(() => {
    fetchRankedNodes(sectionId).then(setRankedNodes);
  }, [sectionId]);

  return rankedNodes;
}

async function fetchRankedNodes(sectionId: number) {
  const client = createFrontendClient();

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

export function toLatLng(node: RankedNode) {
  return { lat: node.latitude, lng: node.longitude };
}
