'use client';

import { Marker, Popup } from "react-leaflet"
import { useState, useRef, useMemo, useCallback } from "react"

export default function DraggableMarker(props: {initialPosition: {
    lat: number;
    lng: number;
}}) {
  const [position, setPosition] = useState(props.initialPosition)
  const markerRef = useRef<L.Marker>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      },
    }),
    [],
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
    </Marker>
  )
}