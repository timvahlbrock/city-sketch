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

const markerIconSize = 10;
const markerIcon = icon({
  iconUrl: "/map/marker.png",
  iconSize: [markerIconSize, markerIconSize], // ToDo: Scale down marker size for better performance
  iconAnchor: [markerIconSize / 2, markerIconSize / 2],
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

  return (
    <>
      <Marker
        draggable={props.isDraggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}
        icon={markerIcon}
      />
    </>
  );
}
