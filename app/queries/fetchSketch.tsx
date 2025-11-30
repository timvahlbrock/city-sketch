import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function fetchSketch(sketchId: Id<"sketches">) {
  const sketch = await fetchQuery(api.sketches.get, { sketchId });
  if (!sketch) {
    throw new Error("Sketch not found");
  }
  return sketch;
}
