import { test } from "./fixtures";
import { expect } from "@playwright/test";

test("adding a node", async ({ page, map }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();
  const mapBounds = await map.getBounds();
  const center = mapBounds.center;
  const east = mapBounds.east;
  const west = mapBounds.west;

  const newNodePosition = {
    lat: center.lat,
    lng: center.lng + (east - west) * 0.3,
  };

  const newNodeXy = await map.getXYFrom(newNodePosition);

  await page.mouse.move(newNodeXy.x, newNodeXy.y);
  await page.mouse.click(newNodeXy.x, newNodeXy.y);

  await page.reload();

  expect(await map.findMarkerAt(newNodePosition)).toBeDefined();
});

test("moving a node", async ({ page, map }) => {
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

test("deleting a node", async ({ page, map }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();
  const mapBounds = await map.getBounds();

  const markerPosition = await map.findMarkerAt(mapBounds.center);
  const markerXy = await map.getXYFrom(markerPosition);

  await page.mouse.move(markerXy.x, markerXy.y);
  await page.mouse.click(markerXy.x, markerXy.y);
  await page.getByText("Delete", { exact: true }).click();

  // somehow the deletion is never visible in the playwright context, but the deletion is applied after a reload
  await page.reload();
  await page.waitForTimeout(3000);

  await map.noMarkerAt(mapBounds.center);
});
