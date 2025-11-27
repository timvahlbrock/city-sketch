"use client";

import { PlusOutlined } from "@ant-design/icons";
import useClient from "@/app/hooks/useClient";
import { useRouter } from "next/navigation";

export interface CreateVisionButtonProps {}

export default function CreateVisionButton({}: CreateVisionButtonProps) {
  const client = useClient();
  const router = useRouter();

  async function handleCreateVision() {
    const createVisionResult = await client
      .from("visions")
      .insert({
        title: "Your new Vision",
        description: "Tell us a little bit about what you imagine.",
        implementationState: "idea",
      })
      .select()
      .single()
      .throwOnError();

    const vision = createVisionResult.data;

    router.push(`vision/${vision.id}/edit`);
  }

  return (
    <>
      <PlusOutlined onClick={() => handleCreateVision()} />
    </>
  );
}
