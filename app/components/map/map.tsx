'use client';

import {MapContainer, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import ExistingBusNetwork from "@/app/components/map/existingBusNetwork";
import useRemoteGeoJson from "@/app/hooks/useRemoteGeoJson";

export interface MapProps {
    isAdding: boolean;
}

export default function Map(props: MapProps) {
    const busData = useRemoteGeoJson('/data/bocholt-busse.geojson');


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

            {/*<DraggableLine*/}
            {/*    initialMarkers={*/}
            {/*        [*/}
            {/*            new LatLng(51.82, 6.60),*/}
            {/*            new LatLng(51.83, 6.60),*/}
            {/*            new LatLng(51.85, 6.60),*/}
            {/*            new LatLng(51.83, 6.61),*/}
            {/*            new LatLng(51.825, 6.61),*/}
            {/*            new LatLng(51.825, 6.60), // the marker on the intersection*/}
            {/*            new LatLng(51.825, 6.58)*/}
            {/*        ]*/}
            {/*    }*/}
            {/*    isAdding={props.isAdding}*/}
            {/*    />*/}
            {busData && <ExistingBusNetwork network={busData} />}
        </MapContainer>
    )
}