"use client";

import { Typography } from "antd";
import { Vision } from "@/app/components/visionSelection/vision";
import useClient from "@/app/hooks/useClient";
import { useRouter } from "next/navigation";

export interface VisionDescriptionProps {
  vision: Vision;
  editable?: boolean;
}

export default function VisionDescription({
  vision,
  editable,
}: VisionDescriptionProps) {
  const client = useClient();
  const router = useRouter();

  async function updateDescription(newDescription: string) {
    await updateDescriptionRemote(vision.id, newDescription);

    router.refresh();
  }

  async function updateDescriptionRemote(
    visionId: number,
    newDescription: string,
  ) {
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
