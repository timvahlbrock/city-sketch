"use client";

import { Typography } from "antd";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
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
  const patchSketch = useMutation(api.sketches.patch);

  if (!sketch) return null;

  async function handleDescriptionUpdate(newDescription: string) {
    await patchSketch({
      sketchId: sketch!._id,
      sketch: {
        description: newDescription,
      },
    });
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
