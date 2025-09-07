'use client';

import { Marker, Popup } from "react-leaflet"
import { useState, useRef, useMemo, useCallback } from "react";

export interface DraggableMarkerProps {
    isDraggable: boolean;
    initialPosition: {
        lat: number;
        lng: number;
    }
    onMarkerUpdate: (newPosition: { lat: number; lng: number }) => void;
}

export default function DraggableMarker(props: DraggableMarkerProps) {
    const { initialPosition, onMarkerUpdate } = props;
    const markerRef = useRef<L.Marker>(null);
    const eventHandlers = useMemo(
        () => ({
            drag() {
                const marker = markerRef.current;
                if (marker != null) {
                    onMarkerUpdate(marker.getLatLng());
                }
            },
        }),
        [],
    );

  return (
    <Marker
      draggable={props.isDraggable}
      eventHandlers={eventHandlers}
      position={initialPosition}
      ref={markerRef}>
    </Marker>
  )
}