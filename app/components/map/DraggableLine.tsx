"use client";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLng } from "@/app/components/map/latLng";
import DraggableMarker from "@/app/components/map/draggableMarker";
import { FeatureCollection, LineString } from "geojson";
import { pushMarkerMoved } from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";

export interface DraggableLineProps {
  initialMarkers: LatLng[];
  isAdding: boolean;
  dataId: string;
}
export default function DraggableLine({
  initialMarkers,
  isAdding,
  dataId,
}: DraggableLineProps) {
  const [markers, setMarkers] = useState<LatLng[]>(initialMarkers);
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
  setPosition: (markers: LatLng | null) => void;
}) {
  useMapEvents({
    mousemove(e) {
      props.setPosition(e.latlng);
    },
  });
  return null;
}

function AddMarkerOnClick(props: {
  setMarkers: (setter: (markers: LatLng[]) => LatLng[]) => void;
}) {
  useMapEvents({
    click(e) {
      props.setMarkers((markers) => [...markers, e.latlng]);
    },
  });
  return null;
}
