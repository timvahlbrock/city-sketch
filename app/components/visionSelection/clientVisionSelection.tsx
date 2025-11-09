"use client";

import { List } from "antd";
import VisionEntry from "@/app/components/visionSelection/visionEntry";
import { Vision } from "@/app/components/visionSelection/vision";

export interface ClientVisionSelectionProps {
  visions: Vision[];
}

export default function ClientVisionSelection({
  visions,
}: ClientVisionSelectionProps) {
  return (
    <List>
      {visions.map((vision) => (
        <VisionEntry key={vision.id} vision={vision} />
      ))}
    </List>
  );
}
