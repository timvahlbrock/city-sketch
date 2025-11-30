import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useCreateSection() {
  const mutation = useMutation(api.sections.create);

  return async (
    visionId: Id<"visions">,
    points: {
      latitude: number;
      longitude: number;
    }[],
  ) => {
    await mutation({ visionId, points });
  };
}
