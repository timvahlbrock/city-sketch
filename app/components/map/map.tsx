'use client';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'; 
import 'leaflet-defaulticon-compatibility';
import { useEffect, useState } from "react";
import DraggableMarker from "./draggableMarker";
import { bezierSpline, lineString } from "@turf/turf";

export interface MapProps {
    isAdding: boolean;
}

export default function Map(props: MapProps) {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([
        { lat: 51.83692, lng: 6.61 },
        { lat: 51.83792, lng: 6.62 },
        { lat: 51.83, lng: 6.63895 },
    ]);
    const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);

    let spline = null;
    const points = markers.concat(mousePosition && props.isAdding ? [mousePosition] : []);
    if(points.length >= 2) {
        const line = lineString(points.map(coord => [coord.lng, coord.lat]));
        spline = bezierSpline(line);
    }

    function markerUpdate(index: number, newPosition: { lat: number; lng: number }) {
        setMarkers((markers) => markers.map((marker, i) => i === index ? newPosition : marker));
    }

    return (
        <MapContainer
            center={[51.83692, 6.61892]}
            zoom={14}
            style={{ height: "100vh", width: "100%" }}

        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {props.isAdding && <AddMarkerOnClick setMarkers={setMarkers} />}
            {markers.map((position, idx) =>
                <DraggableMarker
                    isDraggable={!props.isAdding}
                    key={idx}
                    initialPosition={position}
                    onMarkerUpdate={(newPosition) => {
                        markerUpdate(idx, newPosition);
                    }}
                />
            )}
            <TrackMousePosition setPosition={setMousePosition} />
            {spline && <GeoJSON key={JSON.stringify(spline)} data={spline} style={{ color: 'blue' }} />}
        </MapContainer>
    )
}

function AddMarkerOnClick(props: { setMarkers: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; }[]>> }) {
    useMapEvents({
        click(e) {
            props.setMarkers((markers) => [...markers, e.latlng]);
        },
    });
    return null;
}

function TrackMousePosition(props: { setPosition: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; } | null>> }) {
    const map = useMapEvents({
        mousemove(e) {
            props.setPosition(e.latlng);
        },
    });
    return null;
}