import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";
import { convexErrorWithCode } from "../convexErrorMatcher";

async function createAnonymousIdentity(
  t: ReturnType<typeof convexTest> = convexTest(schema, modules),
) {
  const anonymousUser = await t.run((ctx) =>
    ctx.db.insert("users", {
      isAnonymous: true,
    }),
  );
  return t.withIdentity({
    subject: anonymousUser,
  });
}

describe("Sketches API", () => {
  describe("create", () => {
    it("anonymous users can create a sketch", async () => {
      const asAnonymousUser = await createAnonymousIdentity();

      const sketchId = await asAnonymousUser.mutation(api.sketches.create);

      expect(sketchId).toBeDefined();
    });
  });

  describe("get", () => {
    it("anonymous users can read a sketch", async () => {
      const asAnonymousUser = await createAnonymousIdentity();
      const sketchId = await asAnonymousUser.mutation(api.sketches.create);

      const sketch = await asAnonymousUser.query(api.sketches.get, {
        sketchId,
      });

      expect(sketch).toBeDefined();
    });
  });

  describe("patch", () => {
    it("anonymous users can update their sketch", async () => {
      const asAnonymousUser = await createAnonymousIdentity();
      const sketchId = await asAnonymousUser.mutation(api.sketches.create);

      await asAnonymousUser.mutation(api.sketches.patch, {
        sketchId,
        sketch: {
          title: "Updated title",
          description: "Updated description",
          implementationState: "done",
        },
      });
    });

    it("users cannot update other users sketches", async () => {
      const t = convexTest(schema, modules);
      const asAnonymousUser = await createAnonymousIdentity(t);
      const asOtherAnonymousUser = await createAnonymousIdentity(t);
      const sketchId = await asAnonymousUser.mutation(api.sketches.create);

      await expect(
        asOtherAnonymousUser.mutation(api.sketches.patch, {
          sketchId,
          sketch: {
            title: "Stolen Sketch",
          },
        }),
      ).rejects.toThrowError(convexErrorWithCode(404));
    });
  });
});

// @ts-expect-error Taken fom convexTest documentation, no idea why this is not typescript compatible
const modules = import.meta.glob("./**/*.ts");
