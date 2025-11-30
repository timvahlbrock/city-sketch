import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function useUpdateNodePositionRemote() {
  const mutation = useMutation(api.nodes.updatePosition);

  return (nodeId: Id<"nodes">, { lat, lng }: { lat: number; lng: number }) => {
    return mutation({ nodeId, latitude: lat, longitude: lng });
  };
}
