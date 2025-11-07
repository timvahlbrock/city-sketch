import { createClient } from "@supabase/supabase-js";

export async function pushMarkerMoved(
  nodeId: number,
  position: { lat: number; lng: number },
) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  await client.from("nodes").update({
    id: nodeId,
    latitude: position.lat,
    longitude: position.lng,
  });
}

export async function pushMarkerAdded(
  dataId: number,
  position: { lat: number; lng: number },
) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const previousSectionNode = (
    await client
      .from("sectionsToNodes")
      .select("rank")
      .order("rank", { ascending: false })
      .limit(1)
      .single()
  ).data;

  const newNode = await client
    .from("nodes")
    .insert({
      latitude: position.lat,
      longitude: position.lng,
    })
    .select()
    .single();

  const newNodeId = newNode.data?.id;

  if (!newNodeId) {
    throw new Error("Failed to insert new node");
  }

  const previousRank = previousSectionNode?.rank ?? 0;
  await client.from("sectionsToNodes").insert({
    nodeId: newNodeId,
    sectionId: dataId,
    rank: previousRank + 1,
  });

  return newNode.data;
}
