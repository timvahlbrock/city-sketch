import { LatLng } from "leaflet";
import { Id } from "@/convex/_generated/dataModel";

export interface RankedNode {
  _id: Id<"nodes">;
  latitude: number;
  longitude: number;
  rank: number;
}

export function toLatLng(node: RankedNode) {
  return new LatLng(node.latitude, node.longitude);
}
