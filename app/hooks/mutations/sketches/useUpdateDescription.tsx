import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useUpdateDescription() {
  const mutation = useMutation(api.sketches.patch);

  return async (sketchId: Id<"sketches">, newDescription: string) => {
    await mutation({
      sketchId,
      sketch: { description: newDescription },
    });
  };
}
