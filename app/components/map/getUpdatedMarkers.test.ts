import {describe, expect, it} from "vitest";
import {LatLng} from "leaflet";
import {getUpdatedMarkers} from "./getUpdatedMarkers";
import {leafletSpline} from "./leafletSpline";

describe("getUpdatedMarkers", () => {
    it("should add a marker at the correct position if the clicked location is about half way between the markers", () => {
        const existingMarkers = [
            new LatLng(51.82, 6.60),
            new LatLng(51.83, 6.60),
            new LatLng(51.83, 6.63)
        ];
        const spline = leafletSpline(existingMarkers);

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
        const spline = leafletSpline(existingMarkers);

        const newMarker = new LatLng(51.8225, 6.60);

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
