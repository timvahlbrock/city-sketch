"use client";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import useUpdateTitle from "@/app/hooks/mutations/visions/useUpdateTitle";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface VisionTitleProps {
  preloadedVision: Preloaded<typeof api.visions.get>;
  editable?: boolean;
}

export default function VisionTitle({
  preloadedVision,
  editable,
}: VisionTitleProps) {
  const router = useRouter();
  const updateTitle = useUpdateTitle();
  const vision = usePreloadedQuery(preloadedVision);

  if (!vision) return null;

  async function handleTitleUpdate(newTitle: string) {
    await updateTitle(vision!._id, newTitle);
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
        {vision.title}
      </Typography.Text>
    </>
  );
}
