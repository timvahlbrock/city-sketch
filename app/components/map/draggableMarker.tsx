'use client';

import {Marker} from "react-leaflet"
import {useMemo, useRef} from "react";
import {icon, LatLng} from "leaflet";

export interface DraggableMarkerProps {
    isDraggable: boolean;
    initialPosition: {
        lat: number;
        lng: number;
    }
    onMarkerUpdate: (newPosition: LatLng) => void;
}

const markerIcon = icon({
    iconUrl: "/map/marker.png",
    iconSize: [16, 16], // ToDo: Scale down marker size for better performance
    iconAnchor: [8, 8],
})

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
        ref={markerRef}
        icon={markerIcon}
    />
  )
}