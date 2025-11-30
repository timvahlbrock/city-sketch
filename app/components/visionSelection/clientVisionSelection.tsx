"use client";

import { List } from "antd";
import VisionEntry from "@/app/components/visionSelection/visionEntry";
import { Doc } from "@/convex/_generated/dataModel";

export interface ClientVisionSelectionProps {
  visions: Doc<"visions">[];
}

export default function ClientVisionSelection({
  visions,
}: ClientVisionSelectionProps) {
  return (
    <List>
      {visions.map((vision) => (
        <VisionEntry key={vision._id} vision={vision} />
      ))}
    </List>
  );
}
