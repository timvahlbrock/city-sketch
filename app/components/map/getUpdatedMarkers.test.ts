import {describe, expect, it} from "vitest";
import {LatLng} from "leaflet";
import {getUpdatedMarkers} from "./getUpdatedMarkers";
import {bezierSpline, lineString} from "@turf/turf";

describe("getUpdatedMarkers", () => {
    it("should add a marker at the correct position", () => {
        const existingMarkers = [
            new LatLng(51.824108, 6.604843),
            new LatLng(51.830739, 6.604586),
            new LatLng(51.83, 6.63895)
        ];
        const line = lineString(existingMarkers.map(coord => [coord.lng, coord.lat]));
        const spline = bezierSpline(line).geometry.coordinates.map(coordinate => new LatLng(coordinate[1], coordinate[0]));


        const newMarker = new LatLng(51.830951, 6.623383)
        const newMarkers = getUpdatedMarkers(
            existingMarkers,
            spline,
            newMarker
        );

        expect(existingMarkers[0]).toEqual(newMarkers[0]);
        expect(existingMarkers[1]).toEqual(newMarkers[1]);
        expect(existingMarkers[2]).toEqual(newMarkers[3]);
        expect(newMarkers[2]).toEqual(newMarker);
    });
});
