"use client";

import useClient from "@/app/hooks/useClient";

export default function useUpdateTitle() {
  const client = useClient();

  return async (visionId: number, newTitle: string) => {
    await client
      .from("visions")
      .update({ title: newTitle })
      .eq("id", visionId)
      .single()
      .throwOnError();
  };
}
