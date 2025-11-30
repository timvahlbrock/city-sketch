"use client";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import useUpdateTitle from "@/app/hooks/mutations/visions/useUpdateTitle";
import { Doc } from "@/convex/_generated/dataModel";

export interface VisionTitleProps {
  vision: Doc<"visions">;
  editable?: boolean;
}

export default function VisionTitle({ vision, editable }: VisionTitleProps) {
  const router = useRouter();
  const updateTitle = useUpdateTitle();

  async function handleTitleUpdate(newTitle: string) {
    await updateTitle(vision._id, newTitle);
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
