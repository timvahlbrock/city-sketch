import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    sectionId: v.id("sections"),
    rank: v.number(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, { sectionId, latitude, longitude, rank }) => {
    const nodeId = await ctx.db.insert("nodes", {
      latitude,
      longitude,
    });

    await ctx.db.insert("sectionsToNodes", {
      sectionId,
      nodeId,
      rank,
    });

    return nodeId;
  },
});

export const updatePosition = mutation({
  args: {
    nodeId: v.id("nodes"),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, { nodeId, latitude, longitude }) => {
    await ctx.db.patch(nodeId, {
      latitude,
      longitude,
    });
  },
});

export const deleteNode = mutation({
  args: {
    nodeId: v.id("nodes"),
  },
  handler: async (ctx, { nodeId }) => {
    await ctx.db.delete(nodeId);
  },
});

export const forSection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, { sectionId }) => {
    const sectionsToNodes = await ctx.db
      .query("sectionsToNodes")
      .withIndex("rank")
      .order("asc")
      .filter((q) => q.eq(q.field("sectionId"), sectionId))
      .collect();

    const nodes = await Promise.all(
      sectionsToNodes.map(async (stn) => {
        const node = await ctx.db.get(stn.nodeId);
        if (node === null) {
          return null;
        }
        return {
          rank: stn.rank,
          ...node,
        };
      }),
    );

    return nodes.filter((node) => node !== null) as Exclude<
      (typeof nodes)[number],
      null
    >[];
  },
});
