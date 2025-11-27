"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Bounds } from "@/app/queries/fetchBounds";

export default function FlyIntoBounds({
  visionId,
  bounds,
}: {
  visionId: number;
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
