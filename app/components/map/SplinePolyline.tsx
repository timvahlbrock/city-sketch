"use client";
import leafletSpline from "@/app/components/map/leafletSpline";
import {
  LatLng,
  LatLngLiteral,
  type LeafletEventHandlerFnMap,
  LeafletMouseEvent,
} from "leaflet";
import { Polyline } from "react-leaflet";

export interface BezierLineProps {
  basePoints: readonly LatLngLiteral[];
  onClick?: (precedingMarkerIndex: number, clickedPosition: LatLng) => void;
}

export default function SplinePolyline({
  basePoints,
  onClick,
}: BezierLineProps) {
  if (basePoints.length < 2) {
    return null;
  }

  const spline = leafletSpline(
    basePoints.map((point) => new LatLng(point.lat, point.lng)),
  );

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: (e: LeafletMouseEvent) => handleLineClick(e),
  };

  function handleLineClick(e: LeafletMouseEvent) {
    if (!onClick) {
      return;
    }
    const closestIndex = getIndexOfLinePointClosestTo(
      spline.map((entry) => {
        return entry.latLng;
      }),
      e.latlng,
    );
    if (closestIndex === -1) {
      console.warn("Could not find clicked point in spline, ignoring click");
      return;
    }

    const precedingMarkerIndex = spline[closestIndex].basePointIndex;
    onClick(precedingMarkerIndex, e.latlng);
  }

  return (
    <Polyline
      positions={spline.map((entry) => entry.latLng)}
      pathOptions={{ color: "blue", weight: 5 }}
      eventHandlers={eventHandlers}
    />
  );
}

export function getIndexOfLinePointClosestTo(
  polyline: LatLngLiteral[],
  pointNearLine: LatLngLiteral,
) {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < polyline.length - 1; i++) {
    const coord = polyline[i];
    const distance = Math.sqrt(
      Math.pow(coord.lng - pointNearLine.lng, 2) +
        Math.pow(coord.lat - pointNearLine.lat, 2),
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }
  return closestIndex;
}
