import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api } from "./_generated/api";

async function createAnonymousIdentify(t: ReturnType<typeof convexTest>) {
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
    it("allows users to create a sketch", async () => {
      const t = convexTest(schema, modules);
      const asAnonymousUser = await createAnonymousIdentify(t);

      const sketchId = await asAnonymousUser.mutation(api.sketches.create);

      expect(sketchId).toBeDefined();
    });
  });
});

// @ts-expect-error Taken fom convexTest documentation, no idea why this is not typescript compatible
const modules = import.meta.glob("./**/*.ts");
