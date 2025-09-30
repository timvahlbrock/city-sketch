import {useState} from "react";
import {Polyline, useMapEvents} from "react-leaflet";
import {EventHandlers} from "@mui/utils";
import {LatLng, LeafletMouseEvent} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {getUpdatedMarkers} from "@/app/components/map/getUpdatedMarkers";
import leafletSpline, {SplinePoint} from "@/app/components/map/leafletSpline";

export interface DraggableLineProps {
    isAdding: boolean;
}
export function DraggableLine({isAdding}: DraggableLineProps) {
    const [markers, setMarkers] = useState<LatLng[]>([
        new LatLng(51.82, 6.60),
        new LatLng(51.83, 6.60),
        new LatLng(51.85, 6.60),
        new LatLng(51.83, 6.61),
        new LatLng(51.825, 6.61),
        new LatLng(51.825, 6.60), // the marker on the intersection
        new LatLng(51.825, 6.58)
    ]);
    const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
    console.dir(markers.map(m => m.toString()));

    let spline: SplinePoint[] = [];
    const points = markers.concat(mousePosition && isAdding ? [mousePosition] : []);
    if(points.length >= 2) {
        spline = leafletSpline(points);
    }

    function markerUpdate(index: number, newPosition: LatLng) {
        setMarkers((markers) => markers.map((marker, i) => i === index ? newPosition : marker));
    }

    const eventHandlers: EventHandlers = {
        click: (e: LeafletMouseEvent) => {
            setMarkers(getUpdatedMarkers(markers, spline, e.latlng));
        }
    }

    return <>
        <TrackMousePosition setPosition={setMousePosition} />
        {isAdding && <AddMarkerOnClick setMarkers={setMarkers} />}
        {markers.map((position, idx) =>
            <DraggableMarker
                isDraggable={!isAdding}
                key={idx}
                initialPosition={position}
                onMarkerUpdate={(newPosition) => {
                    markerUpdate(idx, newPosition);
                }}
            />
        )}
        <Polyline positions={spline.map(entry => entry.latLng)} pathOptions={{ color: 'blue' }} eventHandlers={eventHandlers}></Polyline>;
    </>;
}

function TrackMousePosition(props: { setPosition: React.Dispatch<React.SetStateAction<LatLng | null>> }) {
    useMapEvents({
        mousemove(e) {
            props.setPosition(e.latlng);
        },
    });
    return null;
}

function AddMarkerOnClick(props: { setMarkers: React.Dispatch<React.SetStateAction<LatLng[]>> }) {
    useMapEvents({
        click(e) {
            props.setMarkers((markers) => [...markers, e.latlng]);
        },
    });
    return null;
}
