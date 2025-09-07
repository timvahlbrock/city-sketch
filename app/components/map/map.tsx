'use client';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'; 
import 'leaflet-defaulticon-compatibility';
import { use, useState } from "react";
import DraggableMarker from "./draggableMarker";

export default function Map() {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);

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
            <AddMarkerOnClick setMarkers={setMarkers} />
            {markers.map((position, idx) =>
                <DraggableMarker
                    key={idx}
                    initialPosition={position}
                />
            )}
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