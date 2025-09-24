'use client';

import {MapContainer, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {DraggableLine} from "@/app/components/map/DraggableLine";

export interface MapProps {
    isAdding: boolean;
}

export default function Map(props: MapProps) {
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

            <DraggableLine isAdding={props.isAdding}/>
        </MapContainer>
    )
}