import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  visions: defineTable({
    title: v.string(),
    description: v.string(),
    implementationState: v.string(),
  }),
  sections: defineTable({}),
  nodes: defineTable({
    latitude: v.number(),
    longitude: v.number(),
  }),
  sectionsToNodes: defineTable({
    sectionId: v.id("sections"),
    nodeId: v.id("nodes"),
    rank: v.number(),
  })
    .index("sectionId", ["sectionId"])
    .index("nodeId", ["nodeId"])
    .index("rank", ["rank"]),
  visionsToSections: defineTable({
    visionId: v.id("visions"),
    sectionId: v.id("sections"),
  })
    .index("visionId", ["visionId"])
    .index("sectionId", ["sectionId"]),
});
