"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import useMapBounds from "@/app/contexts/map/hooks/useMapBounds";
import { useRouter } from "next/navigation";
import { useCreateSection } from "@/app/hooks/mutations/sections/useCreateSection";
import { Id } from "@/convex/_generated/dataModel";

export default function AddSectionButton({
  visionId,
}: {
  visionId: Id<"visions">;
}) {
  const bounds = useMapBounds();
  const router = useRouter();
  const createSection = useCreateSection();

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

    await createSection(visionId, points);
  }

  return (
    <Button
      icon={<PlusOutlined />}
      style={{ width: "100%" }}
      onClick={handleClick}
      color="blue"
      variant="solid"
    >
      Add Section
    </Button>
  );
}
