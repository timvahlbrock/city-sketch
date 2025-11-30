"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useUpdateTitle() {
  const mutation = useMutation(api.sketches.patch);
  return async (sketchId: Id<"sketches">, newTitle: string) => {
    await mutation({ sketchId, sketch: { title: newTitle } });
  };
}
