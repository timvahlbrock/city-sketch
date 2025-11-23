"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { createFrontendClient } from "@/app/utils/createFrontendClient";
import useMapBounds from "@/app/contexts/map/hooks/useMapBounds";
import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";

export default function AddSectionButton({ visionId }: { visionId: number }) {
  const client = createFrontendClient();
  const bounds = useMapBounds();
  const editorContext = useContext(EditorContext);

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

    editorContext.addNodes(newSection.data.id, [
      {
        id: newNodes.data[0].id,
        latitude: leftPoint[0],
        longitude: leftPoint[1],
        rank: 0,
      },
      {
        id: newNodes.data[1].id,
        latitude: center.lat,
        longitude: center.lng,
        rank: 1,
      },
      {
        id: newNodes.data[2].id,
        latitude: rightPoint[0],
        longitude: rightPoint[1],
        rank: 2,
      },
    ]);
    editorContext.addSections([
      {
        id: newSection.data.id,
      },
    ]);
  }

  return (
    <Button
      icon={<PlusOutlined />}
      style={{ width: "100%" }}
      onClick={handleClick}
    >
      Add Section
    </Button>
  );
}
