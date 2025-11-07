"use client";

import { Marker, useMap } from "react-leaflet";
import { useMemo, useRef, useState } from "react";
import { icon, LatLng, type LeafletEventHandlerFnMap } from "leaflet";
import { TrackMousePosition } from "@/app/components/map/trackMousePosition";

export interface DraggableMarkerProps {
  isDraggable: boolean;
  position: {
    lat: number;
    lng: number;
  };
  onMarkerUpdate?: (newPosition: LatLng) => void;
  onMarkerUpdateEnd?: (newPosition: LatLng) => void;
}

const smallerIconSize = 10;
const smallerIcon = icon({
  iconUrl: "/map/marker.png",
  iconSize: [smallerIconSize, smallerIconSize], // ToDo: Scale down marker size for better performance
  iconAnchor: [smallerIconSize / 2, smallerIconSize / 2],
});

const largerIconSize = 20;
const largerIcon = icon({
  iconUrl: "/map/marker.png",
  iconSize: [largerIconSize, largerIconSize],
  iconAnchor: [largerIconSize / 2, largerIconSize / 2],
});

export default function DraggableMarker(props: DraggableMarkerProps) {
  const { position, onMarkerUpdate } = props;
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () =>
      ({
        drag() {
          const marker = markerRef.current;
          if (marker != null) {
            onMarkerUpdate?.(marker.getLatLng());
          }
        },
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            props.onMarkerUpdateEnd?.(marker.getLatLng());
          }
        },
      }) as LeafletEventHandlerFnMap,
    [onMarkerUpdate, markerRef, props],
  );
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);

  const mapRef = useMap();
  const distance = mousePosition
    ? mapRef
        .latLngToLayerPoint(position)
        .distanceTo(mapRef.latLngToLayerPoint(mousePosition))
    : Infinity;

  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      <Marker
        draggable={props.isDraggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={distance < 30 ? largerIcon : smallerIcon}
      />
    </>
  );
}
