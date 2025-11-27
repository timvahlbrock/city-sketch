"use client";

import useClient from "@/app/hooks/useClient";

export function useCreateVision() {
  const client = useClient();
  return async () => {
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

    return createVisionResult.data;
  };
}
