"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Bounds } from "@/app/queries/fetchBounds";
import { Id } from "@/convex/_generated/dataModel";

export default function FlyIntoBounds({
  sketchId,
  bounds,
}: {
  sketchId: Id<"sketches">;
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
  }, [sketchId, map]);

  return null;
}
