"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import useMapBounds from "@/app/contexts/map/hooks/useMapBounds";
import useClient from "@/app/hooks/useClient";
import { useRouter } from "next/navigation";

export default function AddSectionButton({ visionId }: { visionId: number }) {
  const client = useClient();
  const bounds = useMapBounds();
  const router = useRouter();

  async function handleClick() {
    if (!bounds) return;
    const westEastDistance = Math.abs(bounds.getEast() - bounds.getWest());
    const center = bounds.getCenter();

    const leftPoint = [center.lat, center.lng - westEastDistance * 0.3];
    const rightPoint = [center.lat, center.lng + westEastDistance * 0.3];

    const newSection = await client
      .from("sections")
      .insert({})
      .select("id")
      .single()
      .throwOnError();

    const newNodes = await client
      .from("nodes")
      .insert([
        {
          latitude: leftPoint[0],
          longitude: leftPoint[1],
        },
        {
          latitude: center.lat,
          longitude: center.lng,
        },
        {
          latitude: rightPoint[0],
          longitude: rightPoint[1],
        },
      ])
      .select("id, latitude, longitude")
      .throwOnError();

    await client
      .from("sectionsToNodes")
      .insert([
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[0].id,
          rank: 0,
        },
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[1].id,
          rank: 1,
        },
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[2].id,
          rank: 2,
        },
      ])
      .throwOnError();

    await client.from("visionsToSections").insert({
      sectionId: newSection.data.id,
      visionId: visionId,
    });

    router.refresh();
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
