import {Polyline} from "react-leaflet";
import {Position} from "geojson";
import ExistingBusLinePopup from "@/app/components/map/existingBusNetwork/existingBusLinePopup";
import {FeatureWithProperties} from "@/app/components/map/featureWithProperties";

interface BusLineProps {
    existingLine: FeatureWithProperties;
}

export function ExistingBusLine({existingLine}: BusLineProps) {
    let coordinates: Position[][];
    if(existingLine.geometry.type === "LineString") {
        coordinates = [existingLine.geometry.coordinates];
    } else if(existingLine.geometry.type === "MultiLineString") {
        coordinates = existingLine.geometry.coordinates;
    } else {
        throw new Error(`Unsupported geometry type: ${existingLine.geometry.type}`);
    }

    return coordinates.map((lineCoords, index) => {
        const latLngs = lineCoords.map(coord => [coord[1], coord[0]] as [number, number]);
        return <Polyline
            key={`${existingLine.properties!.id}-${index}`}
            positions={latLngs}
            pathOptions={{color: 'black', weight: 3}}>
            <ExistingBusLinePopup existingLine={existingLine} />
        </Polyline>;
    });
}