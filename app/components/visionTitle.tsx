"use client";

import { Vision } from "@/app/components/visionSelection/vision";
import { Typography } from "antd";
import useClient from "@/app/hooks/useClient";
import { useRouter } from "next/navigation";

export interface VisionTitleProps {
  vision: Vision;
  editable?: boolean;
}

export default function VisionTitle({ vision, editable }: VisionTitleProps) {
  const client = useClient();
  const router = useRouter();

  async function update(newTitle: string) {
    await client
      .from("visions")
      .update({ title: newTitle })
      .eq("id", vision.id)
      .single()
      .throwOnError();

    router.refresh();
  }

  return (
    <>
      <Typography.Text style={{ fontWeight: "bold", fontSize: "x-large" }}>
        {editable && "Editing: "}
      </Typography.Text>

      <Typography.Text
        editable={editable && { onChange: update }}
        style={{ fontWeight: "bold", fontSize: "x-large" }}
      >
        {vision.title}
      </Typography.Text>
    </>
  );
}
