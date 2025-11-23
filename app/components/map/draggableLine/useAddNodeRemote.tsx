import useClient from "@/app/hooks/useClient";

export default function useAddNodeRemote() {
  const client = useClient();

  return async (
    dataId: number,
    rank: number,
    position: { lat: number; lng: number },
  ) => {
    const newNode = await client
      .from("nodes")
      .insert({
        latitude: position.lat,
        longitude: position.lng,
      })
      .select()
      .single()
      .throwOnError();

    await client
      .from("sectionsToNodes")
      .insert({
        nodeId: newNode.data.id,
        sectionId: dataId,
        rank: rank,
      })
      .throwOnError();

    return newNode.data;
  };
}
