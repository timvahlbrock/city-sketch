"use client";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import { FeatureCollection, LineString } from "geojson";
import { pushMarkerMoved } from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";

export interface DraggableLineProps {
  initialMarkers: FeatureCollection;
  isAdding: boolean;
  dataId: string;
}
export default function DraggableLine({
  initialMarkers,
  isAdding,
  dataId,
}: DraggableLineProps) {
  const resolvedMarkers =
    (initialMarkers.features[0].geometry as LineString)?.coordinates.map(
      (coord: number[]) => new LatLng(coord[1], coord[0]),
    ) ?? [];
  const [markers, setMarkers] = useState<LatLng[]>(resolvedMarkers);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);

  const points = markers.concat(
    mousePosition && isAdding ? [mousePosition] : [],
  );

  function markerUpdate(index: number, newPosition: LatLng) {
    pushMarkerMoved(dataId, index, {
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
    setMarkers((markers) =>
      markers.map((marker, i) => (i === index ? newPosition : marker)),
    );
  }
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
      <SplinePolyline basePoints={points} />;
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
