import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";

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
});

// @ts-expect-error Taken fom convexTest documentation, no idea why this is not typescript compatible
const modules = import.meta.glob("./**/*.ts");
