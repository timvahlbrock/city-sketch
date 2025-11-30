import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function fetchVision(visionId: Id<"visions">) {
  const vision = await fetchQuery(api.visions.get, { visionId });
  if (!vision) {
    throw new Error("Vision not found");
  }
  return vision;
}
