import {Marker, Popup} from "react-leaflet";
import {Feature} from "geojson";
import {icon} from "leaflet";
import ExistingBusStopPopup from "@/app/components/map/existingBusNetwork/existingBusStopPopup";

interface ExistingBusStopProps {
    existingStop: Feature
}

const markerIcon = icon({
    iconUrl: "/map/marker.png",
    iconSize: [8, 8],
    iconAnchor: [4, 4],
})

export default function ExistingBusStop({existingStop}: ExistingBusStopProps) {
    if(existingStop.geometry.type !== "Point") {
        throw new Error(`Unsupported geometry type for bus stop: ${existingStop.geometry.type}`);
    }
    const position: [number, number] = [existingStop.geometry.coordinates[1], existingStop.geometry.coordinates[0]];

    return <Marker
        position={position}
        icon={markerIcon}
    >
        <ExistingBusStopPopup existingStop={existingStop}/>
    </Marker>;
}