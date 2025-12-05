import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  sketches: defineTable({
    title: v.string(),
    description: v.string(),
    implementationState: v.string(),
    ownerId: v.id("users"),
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
  sketchesToSections: defineTable({
    sketchId: v.id("sketches"),
    sectionId: v.id("sections"),
  })
    .index("sketchId", ["sketchId"])
    .index("sectionId", ["sectionId"]),
});
