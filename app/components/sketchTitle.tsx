"use client";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import useUpdateTitle from "@/app/hooks/mutations/sketches/useUpdateTitle";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SketchTitleProps {
  preloadedSketch: Preloaded<typeof api.sketches.get>;
  editable?: boolean;
}

export default function SketchTitle({
  preloadedSketch,
  editable,
}: SketchTitleProps) {
  const router = useRouter();
  const updateTitle = useUpdateTitle();
  const sketch = usePreloadedQuery(preloadedSketch);

  if (!sketch) return null;

  async function handleTitleUpdate(newTitle: string) {
    await updateTitle(sketch!._id, newTitle);
    router.refresh();
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
