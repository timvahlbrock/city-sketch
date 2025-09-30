import {useState} from "react";
import {lineString} from "@turf/turf";
import {Polyline, useMapEvents} from "react-leaflet";
import {EventHandlers} from "@mui/utils";
import {LatLng, LeafletMouseEvent} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {getUpdatedMarkers} from "@/app/components/map/getUpdatedMarkers";
import {Fab} from "@mui/material";
import { AccessAlarm } from "@mui/icons-material";
import bezierSpline from "@/app/components/map/spline";

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

    let spline: [number, number,number][] = [];
    const points = markers.concat(mousePosition && isAdding ? [mousePosition] : []);
    if(points.length >= 2) {
        const line = lineString(points.map(coord => [coord.lng, coord.lat]));
        spline = bezierSpline(line);
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
        <Fab
            onClick={() => eventHandlers.click({latlng: new LatLng(51.8225, 6.60)})}
            color={"secondary"}
            style={{
                position: 'absolute',
                bottom: "2rem",
                right: "1rem",
            }}>
            <AccessAlarm />
        </Fab>
        <Polyline positions={spline.map(entry => new LatLng(entry[1], entry[0]))} pathOptions={{ color: 'blue' }} eventHandlers={eventHandlers}></Polyline>;
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
