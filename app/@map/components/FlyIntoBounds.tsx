"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Bounds } from "@/app/queries/fetchBounds";
import { Id } from "@/convex/_generated/dataModel";

export default function FlyIntoBounds({
  visionId,
  bounds,
}: {
  visionId: Id<"visions">;
  bounds: Bounds | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.flyToBounds(
        [
          [bounds.latMin, bounds.lngMin],
          [bounds.latMax, bounds.lngMax],
        ],
        {},
      );
    }
  }, [visionId, map]);

  return null;
}
