"use client";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLng } from "@/app/components/map/latLng";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {
  pushMarkerAdded,
  pushMarkerMoved,
} from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";
import { Database } from "@/app/database.types";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

export interface DraggableLineProps {
  nodes: Node[];
  dataId: number;
}
export default function DraggableLine({ nodes, dataId }: DraggableLineProps) {
  const [markers, setMarkers] = useState<Node[]>(nodes);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const points = markers
    .map((marker) => ({
      lat: marker.latitude,
      lng: marker.longitude,
    }))
    .concat(mousePosition && isAdding ? [mousePosition] : []);

  function markerUpdate(index: number, newPosition: LatLng) {
    const node = markers[index];
    pushMarkerMoved(node.id, {
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
    setMarkers((markers) =>
      markers.map((marker, i) =>
        i === index
          ? {
              id: node.id,
              latitude: newPosition.lat,
              longitude: newPosition.lng,
            }
          : marker,
      ),
    );
  }

  async function markerAdd(newPosition: LatLng) {
    const newNode = await pushMarkerAdded(dataId, newPosition);
    setMarkers([...markers, newNode]);
  }

  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      {isAdding && <AddMarkerOnClick addMarker={markerAdd} />}
      {markers.map((position, idx) => (
        <DraggableMarker
          isDraggable={!isAdding}
          key={idx}
          initialPosition={{
            lat: position.latitude,
            lng: position.longitude,
          }}
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

function AddMarkerOnClick(props: { addMarker: (marker: LatLng) => void }) {
  useMapEvents({
    click(e) {
      props.addMarker(e.latlng);
    },
  });
  return null;
}
