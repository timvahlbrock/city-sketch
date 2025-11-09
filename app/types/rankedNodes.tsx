import { LatLng } from "leaflet";

export interface RankedNode {
  id: number;
  latitude: number;
  longitude: number;
  rank: number;
}

export function toLatLng(node: RankedNode) {
  return new LatLng(node.latitude, node.longitude);
}
