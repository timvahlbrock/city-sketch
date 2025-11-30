import { mutation, query } from "@/convex/_generated/server";
import { v } from "convex/values";
import { notEmpty } from "@/convex/helpers";

export const create = mutation({
  handler: (ctx) => {
    return ctx.db.insert("visions", {
      title: "Your new Vision",
      description: "Tell us a little bit about what you imagine.",
      implementationState: "idea",
    });
  },
});

export const get = query({
  args: {
    visionId: v.id("visions"),
  },
  handler: (ctx, { visionId }) => {
    return ctx.db.get(visionId);
  },
});

export const patch = mutation({
  args: {
    visionId: v.id("visions"),
    vision: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      implementationState: v.optional(v.string()),
    }),
  },
  handler(ctx, { visionId, vision }) {
    return ctx.db.patch(visionId, vision);
  },
});

export const getAll = query({
  handler: (ctx) => {
    return ctx.db.query("visions").collect();
  },
});

export const getBounds = query({
  args: {
    visionId: v.id("visions"),
  },
  handler: async (ctx, { visionId }) => {
    const visionsToSections = await ctx.db
      .query("visionsToSections")
      .withIndex("visionId", (q) => q.eq("visionId", visionId))
      .collect();

    const sectionIds = visionsToSections.map((vts) => vts.sectionId);

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
