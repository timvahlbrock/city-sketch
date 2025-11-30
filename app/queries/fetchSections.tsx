import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";

export async function fetchSections(visionId: Id<"visions">) {
  return fetchQuery(api.sections.forVision, { visionId });
}
