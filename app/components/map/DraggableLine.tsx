import {useState} from "react";
import {bezierSpline, lineString} from "@turf/turf";
import {Polyline, useMapEvents} from "react-leaflet";
import {EventHandlers} from "@mui/utils";
import {LatLng, LeafletMouseEvent} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {getUpdatedMarkers} from "@/app/components/map/getUpdatedMarkers";

export interface DraggableLineProps {
    isAdding: boolean;
}
export function DraggableLine({isAdding}: DraggableLineProps) {
    const [markers, setMarkers] = useState<LatLng[]>([
        new LatLng(51.83692, 6.61),
        new LatLng(51.83792, 6.62),
        new LatLng(51.83, 6.63895),
    ]);
    const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
    console.dir(markers.map(m => m.toString()));

    let spline: LatLng[] = [];
    const points = markers.concat(mousePosition && isAdding ? [mousePosition] : []);
    if(points.length >= 2) {
        const line = lineString(points.map(coord => [coord.lng, coord.lat]));
        spline = bezierSpline(line).geometry.coordinates.map(coordinate => new LatLng(coordinate[1], coordinate[0]));
    }

    function markerUpdate(index: number, newPosition: LatLng) {
        setMarkers((markers) => markers.map((marker, i) => i === index ? newPosition : marker));
    }

    const eventHandlers: EventHandlers = {
        click: (e: LeafletMouseEvent) => {
            alert(e.latlng)
            if(!spline) {
                alert("No spline available");
                return;
            }

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
        <Polyline positions={spline} pathOptions={{ color: 'blue' }} eventHandlers={eventHandlers}></Polyline>;
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
