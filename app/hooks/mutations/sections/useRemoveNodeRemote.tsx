import useClient from "@/app/hooks/useClient";

export default function useRemoveNodeRemote() {
  const client = useClient();

  return async (nodeId: number) =>
    client.from("nodes").delete().eq("id", nodeId).single().throwOnError();
}
