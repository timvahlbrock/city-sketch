import L, {LatLng, LineUtil} from "leaflet";
import pointToSegmentDistance = LineUtil.pointToSegmentDistance;

export function getUpdatedMarkers(
    markers: LatLng[],
    spline: LatLng[],
    clickedPosition: LatLng
): LatLng[] {
    let closestIndex = -1;
    let closestDistance = Infinity;

    for (let i = 0; i < spline.length - 1; i++) {
        const coord = spline[i];
        const distance = Math.sqrt(Math.pow(coord.lng - clickedPosition.lng, 2) + Math.pow(coord.lat - clickedPosition.lat, 2));
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    }

    if (closestIndex === -1) {
        alert("Could not find clicked point in spline");
        return markers;
    }

    let precedingMarkerIndex = -1;
    let minDistance = Infinity;
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const distance = pointToSegmentDistance(L.point(marker.lng, marker.lat), L.point(spline[closestIndex].lng, spline[closestIndex].lat), L.point(spline[closestIndex + 1].lng, spline[closestIndex + 1].lat));
        if (distance < minDistance) {
            minDistance = distance;
            precedingMarkerIndex = i;
        }
    }


    if (precedingMarkerIndex === -1) {
        alert("Could not find preceding marker");
        return markers;
    }

    const newMarkers = [...markers];
    newMarkers.splice(precedingMarkerIndex + 1, 0, clickedPosition);

    return newMarkers;
}