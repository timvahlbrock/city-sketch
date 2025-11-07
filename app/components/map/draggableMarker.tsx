"use client";

import { Marker } from "react-leaflet";
import { useMemo, useRef } from "react";
import { icon, LatLng, type LeafletEventHandlerFnMap } from "leaflet";

export interface DraggableMarkerProps {
  isDraggable: boolean;
  initialPosition: {
    lat: number;
    lng: number;
  };
  onMarkerUpdate?: (newPosition: LatLng) => void;
  onMarkerUpdateEnd?: (newPosition: LatLng) => void;
}

const iconSize = 10;
const markerIcon = icon({
  iconUrl: "/map/marker.png",
  iconSize: [iconSize, iconSize], // ToDo: Scale down marker size for better performance
  iconAnchor: [iconSize / 2, iconSize / 2],
});

export default function DraggableMarker(props: DraggableMarkerProps) {
  const { initialPosition, onMarkerUpdate } = props;
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
    <Marker
      draggable={props.isDraggable}
      eventHandlers={eventHandlers}
      position={initialPosition}
      ref={markerRef}
      icon={markerIcon}
    />
  );
}
