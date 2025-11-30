import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { notEmpty } from "@/convex/helpers";

export const create = mutation({
  args: {
    visionId: v.id("visions"),
    points: v.array(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
  },
  handler: async (ctx, { visionId, points }) => {
    const sectionId = await ctx.db.insert("sections", {});

    await Promise.all(
      points.map(async (point, index) => {
        const nodeId = await ctx.db.insert("nodes", {
          latitude: point.latitude,
          longitude: point.longitude,
        });

        await ctx.db.insert("sectionsToNodes", {
          sectionId,
          nodeId,
          rank: index,
        });
      }),
    );

    await ctx.db.insert("visionsToSections", {
      sectionId,
      visionId,
    });
  },
});

export const del = mutation({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, { sectionId }) => {
    const sectionsToNodes = await ctx.db
      .query("sectionsToNodes")
      .withIndex("sectionId", (q) => q.eq("sectionId", sectionId))
      .collect();
    await Promise.all(sectionsToNodes.map((stn) => ctx.db.delete(stn.nodeId)));
    await ctx.db.delete(sectionId);
  },
});

export const forVision = query({
  args: { visionId: v.id("visions") },
  handler: async (ctx, { visionId }) => {
    const visionsToSections = await ctx.db
      .query("visionsToSections")
      .withIndex("visionId", (q) => q.eq("visionId", visionId))
      .collect();

    return Promise.all(
      visionsToSections.map((vts) => ctx.db.get(vts.sectionId)),
    ).then((sections) => sections.filter(notEmpty));
  },
});
