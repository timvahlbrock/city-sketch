"use client";

import { Typography } from "antd";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SketchTitleProps {
  preloadedSketch: Preloaded<typeof api.sketches.get>;
  editable?: boolean;
}

export default function SketchTitle({
  preloadedSketch,
  editable,
}: SketchTitleProps) {
  const patchSketch = useMutation(api.sketches.patch);
  const sketch = usePreloadedQuery(preloadedSketch);

  if (!sketch) return null;

  async function handleTitleUpdate(newTitle: string) {
    await patchSketch({ sketchId: sketch!._id, sketch: { title: newTitle } });
  }

  return (
    <>
      <Typography.Text style={{ fontWeight: "bold", fontSize: "x-large" }}>
        {editable && "Editing: "}
      </Typography.Text>

      <Typography.Text
        editable={editable && { onChange: handleTitleUpdate }}
        style={{ fontWeight: "bold", fontSize: "x-large" }}
      >
        {sketch.title}
      </Typography.Text>
    </>
  );
}
