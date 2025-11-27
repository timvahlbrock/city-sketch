import { createSsrClient } from "@/app/utils/createSsrClient";

export interface Bounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export async function fetchBounds(visionId: number): Promise<Bounds | null> {
  const client = await createSsrClient();

  const nodes = await client
    .from("visionsToSections")
    .select("sections(nodes(id))")
    .eq("visionId", visionId)
    .throwOnError();

  const nodeIds = nodes.data?.flatMap((section) =>
    section.sections.nodes.flatMap((node) => node.id),
  );

  const latMinResult = (
    await client
      .from("nodes")
      .select("latitude")
      .in("id", nodeIds)
      .order("latitude", { ascending: true })
      .limit(1)
      .throwOnError()
  ).data;

  if (!latMinResult || latMinResult?.length < 1) {
    return null;
  }

  const latMin = latMinResult[0].latitude;

  const latMax = (
    await client
      .from("nodes")
      .select("latitude")
      .in("id", nodeIds)
      .order("latitude", { ascending: false })
      .limit(1)
      .single()
      .throwOnError()
  ).data.latitude;

  const lngMin = (
    await client
      .from("nodes")
      .select("longitude")
      .in("id", nodeIds)
      .order("longitude", { ascending: true })
      .limit(1)
      .single()
      .throwOnError()
  ).data.longitude;

  const lngMax = (
    await client
      .from("nodes")
      .select("longitude")
      .in("id", nodeIds)
      .order("longitude", { ascending: false })
      .limit(1)
      .single()
      .throwOnError()
  ).data.longitude;

  return {
    latMin,
    latMax,
    lngMin,
    lngMax,
  };
}
