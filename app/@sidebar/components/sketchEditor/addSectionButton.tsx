"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import useMapBounds from "@/app/contexts/map/hooks/useMapBounds";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function AddSectionButton({
  sketchId,
}: {
  sketchId: Id<"sketches">;
}) {
  const bounds = useMapBounds();
  const createSection = useMutation(api.sections.create);

  async function handleClick() {
    if (!bounds) return;
    const westEastDistance = Math.abs(bounds.getEast() - bounds.getWest());
    const center = bounds.getCenter();

    const points = [
      {
        latitude: center.lat,
        longitude: center.lng - westEastDistance * 0.3,
      },
      {
        latitude: center.lat,
        longitude: center.lng,
      },
      {
        latitude: center.lat,
        longitude: center.lng + westEastDistance * 0.3,
      },
    ];

    await createSection({ sketchId, points });
  }

  return (
    <Button
      icon={<PlusOutlined />}
      style={{ width: "100%" }}
      onClick={handleClick}
      color="blue"
      variant="solid"
      data-testid="add-section-button"
    >
      Add Section
    </Button>
  );
}
