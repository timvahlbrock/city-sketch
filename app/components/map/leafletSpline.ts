import {Spline} from "./bezierSpline";
import {LatLng} from "leaflet";

export interface SplinePoint {
    latLng: LatLng;
    basePointIndex: number;
}

function leafletSpline(
    line: LatLng[]
): SplinePoint [] {
    const coords: SplinePoint[] = [];
    const points = line.map((pt) => {
        return { x: pt.lng, y: pt.lat };
    });
    const spline = new Spline({
        points,
    });

    const pushCoord = (time: number) => {
        const pos = spline.pos(time);
        if (time % 2 === 0) {
            coords.push({
                latLng: new LatLng(pos[0].y, pos[0].x),
                basePointIndex: pos[1]
            });
        }
    };

    for (let i = 0; i < spline.duration; i += 10) {
        pushCoord(i);
    }
    pushCoord(spline.duration);

    return coords;
}

export { leafletSpline };
export default leafletSpline;