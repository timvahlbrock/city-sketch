import { expect } from "@playwright/test";
import { test } from "./fixtures";

test("adding a section", async ({ page, map }) => {
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

  await Promise.all(
    points.map(async (point) =>
      expect(await map.findMarkerAt(point)).toBeDefined(),
    ),
  );
  expect(await map.findLineThrough(points)).toBeDefined();
});

test("deleting a section", async ({ page, map }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();
  const mapBounds = await map.getBounds();
  await map.findMarkerAt(mapBounds.center);

  await page.getByTestId("delete-section-button").click();
  const mapCenterXy = await map.getXYFrom(mapBounds.center);
  await page.mouse.click(mapCenterXy.x + 20, mapCenterXy.y);

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Delete section?", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(
      "Are you sure you want to delete this section? This cannot be undone.",
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByRole("button").getByText("Delete", { exact: true }).click();
  await expect(dialog).toBeHidden();

  await map.noMarkerAt(mapBounds.center);
});
