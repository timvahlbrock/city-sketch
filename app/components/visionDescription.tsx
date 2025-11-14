"use client";

import { Typography } from "antd";
import { Vision } from "@/app/components/visionSelection/vision";

export default function VisionDescription({ vision }: { vision: Vision }) {
  return (
    <>
      <Typography.Text type={"secondary"}>
        {vision.description || "No description provided."}
      </Typography.Text>
    </>
  );
}
