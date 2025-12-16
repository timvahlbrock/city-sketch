import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("adding a section", async ({ page, map }) => {
  console.log("test");
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();

  page.on("console", console.log);

  const bounds = await map.getBounds();
  const westEastDistance = Math.abs(bounds.east - bounds.west);
  const center = bounds.center;

  const latitude = center.lat;
  const leftMarkerLng = center.lng - westEastDistance * 0.3;
  const centerLng = center.lng;
  const rightMarkerLng = center.lng + westEastDistance * 0.3;

  const points = [
    {
      lat: latitude,
      lng: leftMarkerLng,
    },
    {
      lat: latitude,
      lng: centerLng,
    },
    {
      lat: latitude,
      lng: rightMarkerLng,
    },
  ];

  console.log("Placing markers at", points);
  await Promise.all(
    points.map(async (point) =>
      expect(await map.findMarkerAt(point)).toBeDefined(),
    ),
  );
  expect(await map.findLineThrough(points)).toBeDefined();
});
