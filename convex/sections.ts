import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { notEmpty } from "./helpers";

export const create = mutation({
  args: {
    sketchId: v.id("sketches"),
    points: v.array(
      v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    ),
  },
  handler: async (ctx, { sketchId, points }) => {
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

    await ctx.db.insert("sketchesToSections", {
      sectionId,
      sketchId,
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

export const forSketch = query({
  args: { sketchId: v.id("sketches") },
  handler: async (ctx, { sketchId }) => {
    const sketchesToSections = await ctx.db
      .query("sketchesToSections")
      .withIndex("sketchId", (q) => q.eq("sketchId", sketchId))
      .collect();

    return Promise.all(
      sketchesToSections.map((vts) => ctx.db.get(vts.sectionId)),
    ).then((sections) => sections.filter(notEmpty));
  },
});
