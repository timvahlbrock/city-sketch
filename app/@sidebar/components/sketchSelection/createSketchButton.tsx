"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface CreateSketchButtonProps {}

export default function CreateSketchButton({}: CreateSketchButtonProps) {
  const createVison = useMutation(api.sketches.create);
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
