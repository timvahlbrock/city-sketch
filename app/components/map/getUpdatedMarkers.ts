import L, {LatLng, LineUtil, Point} from "leaflet";
import pointToSegmentDistance = LineUtil.pointToSegmentDistance;

export function getUpdatedMarkers(
    markers: LatLng[],
    spline: LatLng[],
    clickedPosition: LatLng
): LatLng[] {
    let closestIndex = getIndexOfLinePointClosestTo(spline, clickedPosition);
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

export function getPrecedingMarkerIndex(baseLine: LatLng[], spline: LatLng[], closestIndex: number) {
    let precedingMarkerIndex = -1;
    let minDistance = Infinity;
    for (let i = 0; i < baseLine.length - 1; i++) {
        const distance = pointToSegmentDistance(
            new Point(spline[closestIndex].lng, spline[closestIndex].lat),
            new Point(baseLine[i].lng, baseLine[i].lat),
            new Point(baseLine[i+1].lng, baseLine[i].lat)
        );
        if (distance < minDistance) {
            minDistance = distance;
            precedingMarkerIndex = i;
        }
    }
    return precedingMarkerIndex;
}
