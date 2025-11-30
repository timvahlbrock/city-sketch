"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useUpdateTitle() {
  const mutation = useMutation(api.visions.patch);
  return async (visionId: Id<"visions">, newTitle: string) => {
    await mutation({ visionId, vision: { title: newTitle } });
  };
}
