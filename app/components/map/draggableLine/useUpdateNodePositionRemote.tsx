import useClient from "@/app/hooks/useClient";

export default function useUpdateNodePositionRemote() {
  const client = useClient();

  return async (nodeId: number, position: { lat: number; lng: number }) => {
    await client
      .from("nodes")
      .update({
        latitude: position.lat,
        longitude: position.lng,
      })
      .eq("id", nodeId)
      .single()
      .throwOnError();
  };
}
