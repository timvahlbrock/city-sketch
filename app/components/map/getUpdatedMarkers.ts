import {LatLng} from "leaflet";

export function getUpdatedMarkers(
    markers: LatLng[],
    spline: [number, number, number][],
    clickedPosition: LatLng
): LatLng[] {
    let closestIndex = getIndexOfLinePointClosestTo(spline.map(entry => {
    return new LatLng(entry[1], entry[0]);
    }), clickedPosition);
    if (closestIndex === -1) {
        alert("Could not find clicked point in spline");
        return markers;
    }

    let precedingMarkerIndex = getPrecedingMarkerIndex(markers, spline, closestIndex);
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

export function getPrecedingMarkerIndex(baseLine: LatLng[], spline: [number,number,number][], closestIndex: number) {
    return spline[closestIndex][2];
}
