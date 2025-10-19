"use client";
import { use, useState } from "react";
import { Polyline, useMapEvents } from "react-leaflet";
import {
  LatLng,
  type LeafletEventHandlerFnMap,
  LeafletMouseEvent,
} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import { getUpdatedMarkers } from "@/app/components/map/getUpdatedMarkers";
import leafletSpline, { SplinePoint } from "@/app/components/map/leafletSpline";
import { FeatureCollection, LineString } from "geojson";

export interface DraggableLineProps {
  initialMarkers: FeatureCollection;
  isAdding: boolean;
}
export default function DraggableLine({
  initialMarkers,
  isAdding,
}: DraggableLineProps) {
  const resolvedMarkers =
    (initialMarkers.features[0].geometry as LineString)?.coordinates.map(
      (coord: number[]) => new LatLng(coord[1], coord[0]),
    ) ?? [];
  const [markers, setMarkers] = useState<LatLng[]>(resolvedMarkers);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);

  let spline: SplinePoint[] = [];
  const points = markers.concat(
    mousePosition && isAdding ? [mousePosition] : [],
  );
  if (points.length >= 2) {
    spline = leafletSpline(points);
  }

  function markerUpdate(index: number, newPosition: LatLng) {
    setMarkers((markers) =>
      markers.map((marker, i) => (i === index ? newPosition : marker)),
    );
  }

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: (e: LeafletMouseEvent) => {
      setMarkers(getUpdatedMarkers(markers, spline, e.latlng));
    },
  };

  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      {isAdding && <AddMarkerOnClick setMarkers={setMarkers} />}
      {markers.map((position, idx) => (
        <DraggableMarker
          isDraggable={!isAdding}
          key={idx}
          initialPosition={position}
          onMarkerUpdate={(newPosition) => {
            markerUpdate(idx, newPosition);
          }}
        />
      ))}
      <Polyline
        positions={spline.map((entry) => entry.latLng)}
        pathOptions={{ color: "blue", weight: 5 }}
        eventHandlers={eventHandlers}
      ></Polyline>
      ;
    </>
  );
}

function TrackMousePosition(props: {
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
}) {
  useMapEvents({
    mousemove(e) {
      props.setPosition(e.latlng);
    },
  });
  return null;
}

function AddMarkerOnClick(props: {
  setMarkers: React.Dispatch<React.SetStateAction<LatLng[]>>;
}) {
  useMapEvents({
    click(e) {
      props.setMarkers((markers) => [...markers, e.latlng]);
    },
  });
  return null;
}
