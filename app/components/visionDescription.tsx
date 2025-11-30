"use client";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { useUpdateDescription } from "@/app/hooks/mutations/visions/useUpdateDescription";
import { Doc } from "@/convex/_generated/dataModel";

export interface VisionDescriptionProps {
  vision: Doc<"visions">;
  editable?: boolean;
}

export default function VisionDescription({
  vision,
  editable,
}: VisionDescriptionProps) {
  const router = useRouter();
  const updateDescription = useUpdateDescription();

  async function handleDescriptionUpdate(newDescription: string) {
    await updateDescription(vision._id, newDescription);

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
