"use client";

import { Typography } from "antd";
import { useUpdateDescription } from "@/app/hooks/mutations/sketches/useUpdateDescription";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SketchDescriptionProps {
  preloadedSketch: Preloaded<typeof api.sketches.get>;
  editable?: boolean;
}

export default function SketchDescription({
  preloadedSketch,
  editable,
}: SketchDescriptionProps) {
  const sketch = usePreloadedQuery(preloadedSketch);
  const updateDescription = useUpdateDescription();

  if (!sketch) return null;

  async function handleDescriptionUpdate(newDescription: string) {
    await updateDescription(sketch!._id, newDescription);
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
        {sketch.description || "No description provided."}
      </Typography.Text>
    </>
  );
}
