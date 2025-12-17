import { test as base } from "@playwright/test";
import { MapFixture } from "@/e2e/mapFixture";

interface Fixtures {
  map: MapFixture;
}

export const test = base.extend<Fixtures>({
  map: async ({ page }, use) => {
    const mapFixture = new MapFixture(page);
    await mapFixture.ready;
    await use(mapFixture);
  },
});
