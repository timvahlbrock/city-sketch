import { Spline } from "./bezierSpline";
import { LatLngLiteral } from "leaflet";

export interface SplinePoint {
  latLng: LatLngLiteral;
  basePointIndex: number;
}

function leafletSpline(line: LatLngLiteral[]): SplinePoint[] {
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
        latLng: { lat: pos[0].y, lng: pos[0].x },
        basePointIndex: pos[1],
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
