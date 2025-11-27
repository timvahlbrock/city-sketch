"use client";

import { Typography } from "antd";
import { Vision } from "@/app/components/visionSelection/vision";
import { useRouter } from "next/navigation";
import { useUpdateDescription } from "@/app/hooks/mutations/visions/useUpdateDescription";

export interface VisionDescriptionProps {
  vision: Vision;
  editable?: boolean;
}

export default function VisionDescription({
  vision,
  editable,
}: VisionDescriptionProps) {
  const router = useRouter();
  const updateDescription = useUpdateDescription();

  async function handleDescriptionUpdate(newDescription: string) {
    await updateDescription(vision.id, newDescription);

    router.refresh();
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
