import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function useRemoveNodeRemote() {
  const mutation = useMutation(api.nodes.deleteNode);

  return async (nodeId: Id<"nodes">) => {
    await mutation({ nodeId });
  };
}
