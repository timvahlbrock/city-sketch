import {Polyline, Popup} from "react-leaflet";
import {Feature, FeatureCollection} from "geojson";

interface Props {
    network: FeatureCollection;
}

export default function ExistingBusNetwork({ network }: Props) {
    const filteredFeatures = (network?.features ?? [])
        .filter(feature => feature.properties)
        .filter(feature => feature.properties!.type == "route")
        .filter(feature => feature.properties!.route == "bus");

    return filteredFeatures
        .map(feature => {
            if(feature.geometry.type == "LineString") {
                const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
                return <Polyline
                    key={feature.properties?.id}
                    positions={coordinates}
                    pathOptions={{ color: 'black', weight: 3 }}>
                    <Popup>
                        <h1>{feature.properties!.name}</h1>
                    </Popup>
                </Polyline>;
            } else if(feature.geometry.type == "MultiLineString") {
                return feature.geometry.coordinates.map((lineCoords, index) => {
                    const coordinates = lineCoords.map(coord => [coord[1], coord[0]] as [number, number]);
                    return <Polyline
                        key={`${feature.properties!.id}-${index}`}
                        positions={coordinates}
                        pathOptions={{ color: 'black', weight: 3 }} >
                        <Popup>
                            <h1>{feature.properties!.name}</h1>
                        </Popup>
                    </Polyline>;
                });
            }
        })
}