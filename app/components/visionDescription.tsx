"use client";

import { Typography } from "antd";
import { useUpdateDescription } from "@/app/hooks/mutations/visions/useUpdateDescription";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface VisionDescriptionProps {
  preloadedVision: Preloaded<typeof api.visions.get>;
  editable?: boolean;
}

export default function VisionDescription({
  preloadedVision,
  editable,
}: VisionDescriptionProps) {
  const vision = usePreloadedQuery(preloadedVision);
  const updateDescription = useUpdateDescription();

  if (!vision) return null;

  async function handleDescriptionUpdate(newDescription: string) {
    await updateDescription(vision!._id, newDescription);
  }

  return (
    <>
      <Typography.Text
        type={"secondary"}
        editable={
          editable && {
            onChange: handleDescriptionUpdate,
          }
        }
      >
        {vision.description || "No description provided."}
      </Typography.Text>
    </>
  );
}
