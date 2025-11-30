import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export interface Bounds {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

export async function fetchBounds(
  sketchId: Id<"sketches">,
): Promise<Bounds | null> {
  return fetchQuery(api.sketches.getBounds, { sketchId });
}
