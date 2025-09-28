import {describe, expect, it} from "vitest";
import {LatLng} from "leaflet";
import {getIndexOfLinePointClosestTo, getPrecedingMarkerIndex, getUpdatedMarkers} from "./getUpdatedMarkers";
import {bezierSpline, lineString} from "@turf/turf";

describe("getUpdatedMarkers", () => {
    const existingMarkers = [
        new LatLng(51.82, 6.60),
        new LatLng(51.83, 6.60),
        new LatLng(51.83, 6.63)
    ];
    const line = lineString(existingMarkers.map(coord => [coord.lng, coord.lat]));
    const spline = bezierSpline(line).geometry.coordinates.map(coordinate => new LatLng(coordinate[1], coordinate[0]));
    it("getIndexOfLinePointClosestTo", () => {
        const indexOfLinePointClosestTo = getIndexOfLinePointClosestTo(spline, new LatLng(51.83, 6.615));
        expect(spline[indexOfLinePointClosestTo].lat).toBeCloseTo(51.83, 2);
        expect(spline[indexOfLinePointClosestTo].lng).toBeCloseTo(6.615, 3);
    });

    it("getPrecedingMarkerIndex", () => {
        const closestIndex = getIndexOfLinePointClosestTo(spline, new LatLng(51.83, 6.615));
        const precedingMarkerIndex = getPrecedingMarkerIndex(existingMarkers, spline, closestIndex);
        expect(precedingMarkerIndex).toEqual(1);
    });

    it("should add a marker at the correct position", () => {
        const newMarker = new LatLng(51.83, 6.615)
        const newMarkers = getUpdatedMarkers(
            existingMarkers,
            spline,
            newMarker
        );

        expect(newMarkers[0]).toEqual(existingMarkers[0]);
        expect(newMarkers[1]).toEqual(existingMarkers[1]);
        expect(newMarkers[3]).toEqual(existingMarkers[2]);
        expect(newMarkers[2]).toEqual(newMarker);
    });
});
