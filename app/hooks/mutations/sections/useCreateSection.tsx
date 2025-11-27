import useClient from "@/app/hooks/useClient";

export function useCreateSection() {
  const client = useClient();

  return async (
    visionId: number,
    points: {
      latitude: number;
      longitude: number;
    }[],
  ) => {
    const newSection = await client
      .from("sections")
      .insert({})
      .select("id")
      .single()
      .throwOnError();

    const newNodes = await client
      .from("nodes")
      .insert(points)
      .select("id, latitude, longitude")
      .throwOnError();

    await client
      .from("sectionsToNodes")
      .insert([
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[0].id,
          rank: 0,
        },
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[1].id,
          rank: 1,
        },
        {
          sectionId: newSection.data.id,
          nodeId: newNodes.data[2].id,
          rank: 2,
        },
      ])
      .throwOnError();

    await client.from("visionsToSections").insert({
      sectionId: newSection.data.id,
      visionId: visionId,
    });
  };
}
