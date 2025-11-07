"use client";
import DraggableLine from "@/app/components/map/draggableLine";
import { useRankedNodes } from "@/app/hooks/rankedNodes";

export interface SectionProps {
  sectionId: number;
}

export function Section({ sectionId }: SectionProps) {
  const rankedNodes = useRankedNodes(sectionId);
  return <DraggableLine initialNodes={rankedNodes} dataId={sectionId} />;
}
