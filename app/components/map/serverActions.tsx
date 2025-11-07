import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/app/database.types";

function createSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export async function pushMarkerMoved(
  nodeId: number,
  position: { lat: number; lng: number },
) {
  createSupabaseClient()
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
  position: { lat: number; lng: number },
) {
  const client = createSupabaseClient();

  const previousSectionNode = (
    await client
      .from("sectionsToNodes")
      .select("rank")
      .order("rank", { ascending: false })
      .limit(1)
      .single()
      .throwOnError()
  ).data;

  const newNode = await client
    .from("nodes")
    .insert({
      latitude: position.lat,
      longitude: position.lng,
    })
    .select()
    .single()
    .throwOnError();

  const previousRank = previousSectionNode.rank;
  await client.from("sectionsToNodes").insert({
    nodeId: newNode.data.id,
    sectionId: dataId,
    rank: previousRank + 1,
  });

  return newNode.data;
}
