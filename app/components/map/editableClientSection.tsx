"use client";

import DraggableLine from "@/app/components/map/draggableLine/draggableLine";
import { RankedNode } from "@/app/types/rankedNodes";
import { useEffect, useState } from "react";
import useClient from "@/app/hooks/useClient";

export interface SectionProps {
  sectionId: number;
  editable: boolean;
}

export function EditableClientSection({ sectionId, editable }: SectionProps) {
  const rankedNodes = useRankedNodes(sectionId);

  return (
    <DraggableLine
      serverNodes={rankedNodes}
      sectionId={sectionId}
      isEditable={editable}
    />
  );
}

export function useRankedNodes(sectionId: number) {
  const [nodes, setNodes] = useState<RankedNode[]>([]);
  const client = useClient();

  useEffect(() => {
    async function fetchRankedNodes(sectionId: number) {
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

    fetchRankedNodes(sectionId).then((rankedNodes) => setNodes(rankedNodes));
  }, [sectionId, client]);

  return nodes;
}
