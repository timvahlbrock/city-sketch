"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCreateSketch } from "@/app/hooks/mutations/sketches/useCreateSketch";

export interface CreateSketchButtonProps {}

export default function CreateSketchButton({}: CreateSketchButtonProps) {
  const createVison = useCreateSketch();
  const router = useRouter();

  async function handleCreateSketch() {
    const sketchId = await createVison();
    router.push(`sketch/${sketchId}/edit`);
  }

  return (
    <>
      <PlusOutlined onClick={() => handleCreateSketch()} />
    </>
  );
}
