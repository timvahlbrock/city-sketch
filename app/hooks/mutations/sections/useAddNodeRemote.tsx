import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useAddNodeRemote() {
  const mutation = useMutation(api.nodes.create);

  return async (
    sectionId: Id<"sections">,
    rank: number,
    position: { lat: number; lng: number },
  ) => {
    return mutation({
      sectionId,
      rank,
      latitude: position.lat,
      longitude: position.lng,
    });
  };
}
