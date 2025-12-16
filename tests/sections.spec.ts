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

  await Promise.all(
    points.map(async (point) =>
      expect(await map.findMarkerAt(point)).toBeDefined(),
    ),
  );
  expect(await map.findLineThrough(points)).toBeDefined();
});

test("moving a node of a section", async ({ page, map }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();
  const mapBounds = await map.getBounds();

  const oldMarkerPosition = await map.findMarkerAt(mapBounds.center);
  const newMarkerPosition = {
    lat: mapBounds.center.lat + (mapBounds.north - mapBounds.south) * 0.2,
    lng: mapBounds.center.lng + (mapBounds.east - mapBounds.west) * 0.2,
  };

  const oldMarkerXy = await map.getXYFrom(oldMarkerPosition);
  const newMarkerXy = await map.getXYFrom(newMarkerPosition);

  await page.mouse.move(oldMarkerXy.x, oldMarkerXy.y);
  await page.mouse.down();
  await page.mouse.move(newMarkerXy.x, newMarkerXy.y);
  await page.mouse.up();

  await page.reload();

  expect(await map.findMarkerAt(newMarkerPosition)).toBeDefined();
});

test("removing a section", async ({ page, map }) => {
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
});
