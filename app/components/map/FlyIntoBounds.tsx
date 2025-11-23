"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import useClient from "@/app/hooks/useClient";

export default function FlyIntoBounds({ visionId }: { visionId: number }) {
  const map = useMap();
  const client = useClient();

  useEffect(() => {
    (async function () {
      const nodes = await client
        .from("visionsToSections")
        .select("sections(nodes(id))")
        .eq("visionId", visionId)
        .throwOnError();

      const nodeIds = nodes.data?.flatMap((section) =>
        section.sections.nodes.flatMap((node) => node.id),
      );

      const latMin = (
        await client
          .from("nodes")
          .select("latitude")
          .in("id", nodeIds)
          .order("latitude", { ascending: true })
          .limit(1)
          .single()
          .throwOnError()
      ).data.latitude;

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

      map.flyToBounds(
        [
          [latMin, lngMin],
          [latMax, lngMax],
        ],
        {},
      );
    })().catch(console.error);
  }, [visionId, map]);

  return null;
}
