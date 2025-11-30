import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useUpdateDescription() {
  const mutation = useMutation(api.visions.patch);

  return async (visionId: Id<"visions">, newDescription: string) => {
    await mutation({
      visionId,
      vision: { description: newDescription },
    });
  };
}
