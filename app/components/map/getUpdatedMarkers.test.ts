import {describe, expect, it} from "vitest";
import {LatLng} from "leaflet";
import {getIndexOfLinePointClosestTo, getPrecedingMarkerIndex, getUpdatedMarkers} from "./getUpdatedMarkers";
import { lineString} from "@turf/turf";
import {bezierSpline} from "./spline";

describe("getUpdatedMarkers", () => {
    it("should add a marker at the correct position if the clicked location is about half way between the markers", () => {
        const existingMarkers = [
            new LatLng(51.82, 6.60),
            new LatLng(51.83, 6.60),
            new LatLng(51.83, 6.63)
        ];
        const line = lineString(existingMarkers.map(coord => [coord.lng, coord.lat]));
        const spline = bezierSpline(line);

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

    it("should add a marker at the correct position if a marker that belongs to another section of the line is close", () => {
        const existingMarkers = [
            new LatLng(51.82, 6.60),
            new LatLng(51.83, 6.60),
            new LatLng(51.85, 6.60),
            new LatLng(51.83, 6.61),
            new LatLng(51.825, 6.61),
            new LatLng(51.825, 6.60), // the marker on the intersection
            new LatLng(51.825, 6.58)
        ];
        const line = lineString(existingMarkers.map(coord => [coord.lng, coord.lat]));
        const spline = bezierSpline(line);

        const newMarker = new LatLng(51.8225, 6.60);

        const closestIndex = getIndexOfLinePointClosestTo(spline.map(entry => {
            return new LatLng(entry[1], entry[0]);
        }), newMarker);
        expect(spline[closestIndex][1]).toBeLessThan(51.825);
        expect(spline[closestIndex][0]).toBeCloseTo(6.60, 2);

        const precedingMarkerIndex = getPrecedingMarkerIndex(existingMarkers, spline, closestIndex);
        expect(precedingMarkerIndex).toEqual(0);

        const newMarkers = getUpdatedMarkers(
            existingMarkers,
            spline,
            newMarker
        );

        expect(newMarkers[0]).toEqual(existingMarkers[0]);
        expect(newMarkers[1]).toEqual(newMarker);
        expect(newMarkers[2]).toEqual(existingMarkers[1]);
        expect(newMarkers[3]).toEqual(existingMarkers[2]);
        expect(newMarkers[4]).toEqual(existingMarkers[3]);
        expect(newMarkers[5]).toEqual(existingMarkers[4]);
        expect(newMarkers[6]).toEqual(existingMarkers[5]);
        expect(newMarkers[7]).toEqual(existingMarkers[6]);
    });
});
