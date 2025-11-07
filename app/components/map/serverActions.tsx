import { createFrontendClient } from "@/app/createFrontendClient";

export async function pushMarkerMoved(
  nodeId: number,
  position: { lat: number; lng: number },
) {
  await createFrontendClient()
    .from("nodes")
    .update({
      latitude: position.lat,
      longitude: position.lng,
    })
    .eq("id", nodeId)
    .single()
    .throwOnError();
}

export async function pushMarkerAdded(
  dataId: number,
  rank: number,
  position: { lat: number; lng: number },
) {
  const client = createFrontendClient();

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
}
