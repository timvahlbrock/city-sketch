'use client';

import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import {FeatureCollection} from "geojson";
import {useEffect, useState} from "react";

export interface MapProps {
    isAdding: boolean;
}

function useBusData() {
    const [busData, setBusData] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        fetch('/data/busses-borken.geojson')
            .then(response => response.json())
            .then(data => setBusData(data))
            .catch(error => console.error('Error fetching bus data:', error));
    }, []);

    return busData;
}

export default function Map(props: MapProps) {
    const busData = useBusData();

    const filteredFeatures = (busData?.features ?? [])
        .filter(feature => feature.properties)
        .filter(feature => feature.properties!.type === "route")
        .filter(feature => feature.properties!.ref?.startsWith("C"));

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
            {filteredFeatures
                .map(feature => {
                if(feature.geometry.type == "LineString") {
                    const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
                    return <Polyline
                        key={feature.properties?.id}
                        positions={coordinates}
                        pathOptions={{ color: 'black', weight: 3 }} />;
                } else if(feature.geometry.type == "MultiLineString") {
                    return feature.geometry.coordinates.map((lineCoords, index) => {
                        const coordinates = lineCoords.map(coord => [coord[1], coord[0]] as [number, number]);
                        return <Polyline
                                    key={`${feature.properties?.id}-${index}`}
                                    positions={coordinates}
                                    pathOptions={{ color: 'black', weight: 3 }} />;
                    });
                }
            })}
        </MapContainer>
    )
}