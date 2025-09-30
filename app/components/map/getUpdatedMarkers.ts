import {LatLng} from "leaflet";
import {SplinePoint} from "@/app/components/map/leafletSpline";

export function getUpdatedMarkers(
    markers: LatLng[],
    spline: SplinePoint[],
    clickedPosition: LatLng
): LatLng[] {
    let closestIndex = getIndexOfLinePointClosestTo(spline.map(entry => {
        return entry.latLng
    }), clickedPosition);
    if (closestIndex === -1) {
        alert("Could not find clicked point in spline");
        return markers;
    }

    let precedingMarkerIndex = getPrecedingMarkerIndex(spline, closestIndex);
    if (precedingMarkerIndex === -1) {
        alert("Could not find preceding marker");
        return markers;
    }

    const newMarkers = [...markers];
    newMarkers.splice(precedingMarkerIndex + 1, 0, clickedPosition);

    return newMarkers;
}

export function getIndexOfLinePointClosestTo(polyline: LatLng[], pointNearLine: LatLng) {
    let closestIndex = -1;
    let closestDistance = Infinity;

    for (let i = 0; i < polyline.length - 1; i++) {
        const coord = polyline[i];
        const distance = Math.sqrt(Math.pow(coord.lng - pointNearLine.lng, 2) + Math.pow(coord.lat - pointNearLine.lat, 2));
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    }
    return closestIndex;
}

export function getPrecedingMarkerIndex(spline: SplinePoint[], closestIndex: number) {
    return spline[closestIndex].basePointIndex
}
