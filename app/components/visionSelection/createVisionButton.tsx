"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCreateVision } from "@/app/hooks/mutations/useCreateVision";

export interface CreateVisionButtonProps {}

export default function CreateVisionButton({}: CreateVisionButtonProps) {
  const createVison = useCreateVision();
  const router = useRouter();

  async function handleCreateVision() {
    const vision = await createVison();
    router.push(`vision/${vision.id}/edit`);
  }

  return (
    <>
      <PlusOutlined onClick={() => handleCreateVision()} />
    </>
  );
}
