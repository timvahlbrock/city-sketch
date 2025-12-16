import { test as base } from "@playwright/test";
import { MapFixture } from "@/tests/mapFixture";

interface Fixtures {
  map: MapFixture;
}

export const test = base.extend<Fixtures>({
  map: async ({ page }, use) => {
    await use(new MapFixture(page));
  },
});
