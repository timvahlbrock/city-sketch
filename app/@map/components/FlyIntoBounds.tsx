"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function FlyIntoBounds({
  sketchId,
  bounds,
}: {
  sketchId: Id<"sketches">;
  bounds: {
    latMin: number;
    lngMin: number;
    latMax: number;
    lngMax: number;
  } | null;
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
