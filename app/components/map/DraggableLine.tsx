import {useState} from "react";
import {Feature, LineString} from "geojson";
import {bezierSpline, lineString} from "@turf/turf";
import {GeoJSON, useMapEvents} from "react-leaflet";
import {EventHandlers} from "@mui/utils";
import L, {LineUtil} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import pointToSegmentDistance = LineUtil.pointToSegmentDistance;

export interface DraggableLineProps {
    isAdding: boolean;
}
export function DraggableLine({isAdding}: DraggableLineProps) {
    const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([
        { lat: 51.83692, lng: 6.61 },
        { lat: 51.83792, lng: 6.62 },
        { lat: 51.83, lng: 6.63895 },
    ]);
    const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);

    let spline: Feature<LineString> | null = null;
    const points = markers.concat(mousePosition && isAdding ? [mousePosition] : []);
    if(points.length >= 2) {
        const line = lineString(points.map(coord => [coord.lng, coord.lat]));
        spline = bezierSpline(line);
    }

    function markerUpdate(index: number, newPosition: { lat: number; lng: number }) {
        setMarkers((markers) => markers.map((marker, i) => i === index ? newPosition : marker));
    }

    if(!spline) {
        return null;
    }

    const eventHandlers: EventHandlers = {
        click: (e) => {
            if(!spline) {
                alert("No spline available");
                return;
            }

            let closestIndex = -1;
            let closestDistance = Infinity;

            for(let i = 0; i < spline.geometry.coordinates.length - 1; i++) {
                const coord = spline.geometry.coordinates[i];
                const distance = Math.sqrt(Math.pow(coord[0] - e.latlng.lng, 2) + Math.pow(coord[1] - e.latlng.lat, 2));
                if(distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            }

            if(closestIndex === -1) {
                alert("Could not find clicked point in spline");
                return;
            }

            let precedingMarkerIndex = -1;
            let minDistance = Infinity;
            for(let i = 0; i < markers.length; i++) {
                const marker = markers[i];
                const distance = pointToSegmentDistance(L.point(marker.lng, marker.lat), L.point(spline.geometry.coordinates[closestIndex][0], spline.geometry.coordinates[closestIndex][1]), L.point(spline.geometry.coordinates[closestIndex + 1][0], spline.geometry.coordinates[closestIndex + 1][1]));
                if(distance < minDistance) {
                    minDistance = distance;
                    precedingMarkerIndex = i;
                }
            }


            if(precedingMarkerIndex === -1) {
                alert("Could not find preceding marker");
                return;
            }

            const newMarker = { lat: e.latlng.lat, lng: e.latlng.lng };
            setMarkers((markers) => {
                const newMarkers = [...markers];
                newMarkers.splice(precedingMarkerIndex + 1, 0, newMarker);
                return newMarkers;
            });
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
        <GeoJSON key={JSON.stringify(spline)} data={spline} style={{ color: 'blue' }} eventHandlers={eventHandlers} />
    </>;
}

function TrackMousePosition(props: { setPosition: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; } | null>> }) {
    useMapEvents({
        mousemove(e) {
            props.setPosition(e.latlng);
        },
    });
    return null;
}

function AddMarkerOnClick(props: { setMarkers: React.Dispatch<React.SetStateAction<{ lat: number; lng: number; }[]>> }) {
    useMapEvents({
        click(e) {
            props.setMarkers((markers) => [...markers, e.latlng]);
        },
    });
    return null;
}
