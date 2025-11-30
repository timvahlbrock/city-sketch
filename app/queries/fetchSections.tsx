import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

export async function fetchSections(sketchId: Id<"sketches">) {
  return fetchQuery(api.sections.forSketch, { sketchId });
}
