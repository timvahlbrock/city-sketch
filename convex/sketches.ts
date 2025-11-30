import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { notEmpty } from "./helpers";

export const create = mutation({
  handler: (ctx) => {
    return ctx.db.insert("sketches", {
      title: "Your new Sketch",
      description: "Tell us a little bit about what you imagine.",
      implementationState: "idea",
    });
  },
});

export const get = query({
  args: {
    sketchId: v.id("sketches"),
  },
  handler: (ctx, { sketchId }) => {
    return ctx.db.get(sketchId);
  },
});

export const patch = mutation({
  args: {
    sketchId: v.id("sketches"),
    sketch: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      implementationState: v.optional(v.string()),
    }),
  },
  handler(ctx, { sketchId, sketch }) {
    return ctx.db.patch(sketchId, sketch);
  },
});

export const getAll = query({
  handler: (ctx) => {
    return ctx.db.query("sketches").collect();
  },
});

export const getBounds = query({
  args: {
    sketchId: v.id("sketches"),
  },
  handler: async (ctx, { sketchId }) => {
    const sketchesToSections = await ctx.db
      .query("sketchesToSections")
      .withIndex("sketchId", (q) => q.eq("sketchId", sketchId))
      .collect();

    const sectionIds = sketchesToSections.map((vts) => vts.sectionId);

    const sectionsToNodes = await Promise.all(
      sectionIds.map(async (sectionId) => {
        return ctx.db
          .query("sectionsToNodes")
          .withIndex("sectionId", (q) => q.eq("sectionId", sectionId))
          .collect();
      }),
    );

    const nodes = (
      await Promise.all(
        sectionsToNodes.flat().map((stn) => ctx.db.get(stn.nodeId)),
      )
    ).filter(notEmpty);

    if (nodes.length == 0) {
      return null;
    }

    const minLatitude = Math.min(...nodes.map((node) => node.latitude));
    const maxLatitude = Math.max(...nodes.map((node) => node.latitude));
    const minLongitude = Math.min(...nodes.map((node) => node.longitude));
    const maxLongitude = Math.max(...nodes.map((node) => node.longitude));

    return {
      latMin: minLatitude,
      latMax: maxLatitude,
      lngMin: minLongitude,
      lngMax: maxLongitude,
    };
  },
});
