"use client";

import { Typography } from "antd";
import { Vision } from "@/app/components/visionSelection/vision";
import { useContext } from "react";
import { EditorContext } from "@/app/contexts/editor/editorContext";
import { createFrontendClient } from "@/app/utils/createFrontendClient";

export interface VisionDescriptionProps {
  vision: Vision;
  editable?: boolean;
}

export default function VisionDescription({
  vision,
  editable,
}: VisionDescriptionProps) {
  const { updatedVisions, updateVision } = useContext(EditorContext);
  async function updateDescription(newDescription: string) {
    await updateDescriptionRemote(vision.id, newDescription);

    updateVision({
      ...vision,
      description: newDescription,
    });
  }

  vision = updatedVisions.get(vision.id) ?? vision;

  async function updateDescriptionRemote(
    visionId: number,
    newDescription: string,
  ) {
    const client = createFrontendClient();
    await client
      .from("visions")
      .update({ description: newDescription })
      .eq("id", visionId)
      .single()
      .throwOnError();
  }

  return (
    <>
      <Typography.Text
        type={"secondary"}
        editable={
          editable && {
            onChange: updateDescription,
          }
        }
      >
        {vision.description || "No description provided."}
      </Typography.Text>
    </>
  );
}
