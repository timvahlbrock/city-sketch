import test, { expect, Page } from "@playwright/test";
import { type Layer, type Marker } from "leaflet";

test("adding a section", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("create-sketch-button").click();
  await page.getByTestId("add-section-button").click();

  const bounds = await getMapBounds(page);
  const westEastDistance = Math.abs(bounds.east - bounds.west);
  const center = bounds.center;

  const latitude = center.lat;
  const leftMarkerLng = center.lng - westEastDistance * 0.3;
  const centerLng = center.lng;
  const rightMarkerLng = center.lng + westEastDistance * 0.3;

  const leftMarker = await findMarker(page, {
    lat: latitude,
    lng: leftMarkerLng,
  });
  const centerMarker = await findMarker(page, {
    lat: latitude,
    lng: centerLng,
  });
  const rightMarker = await findMarker(page, {
    lat: latitude,
    lng: rightMarkerLng,
  });

  expect(leftMarker).toBeDefined();
  expect(centerMarker).toBeDefined();
  expect(rightMarker).toBeDefined();
});

async function getMapBounds(page: Page) {
  while (true) {
    const bounds = await page.evaluate(() => {
      if (!window.leafletMap) return undefined;
      const bounds = window.leafletMap.getBounds();
      return {
        east: bounds.getEast(),
        west: bounds.getWest(),
        center: {
          lat: bounds.getCenter().lat,
          lng: bounds.getCenter().lng,
        },
      };
    });

    if (bounds) return bounds;

    await page.waitForTimeout(100);
  }
}

async function findMarker(
  page: Page,
  targetLatLng: { lat: number; lng: number },
  maxDistance: number = 10,
) {
  while (true) {
    const foundMarker = await page.evaluate(
      ({ targetLatLng, maxDistance }) => {
        const layers: Layer[] = [];
        window.leafletMap?.eachLayer((layer) => layers.push(layer));
        for (const layer of layers) {
          if (!isMarker(layer)) continue;
          const markerLatLng = layer.getLatLng();
          const distance = window.leafletMap!.distance(
            targetLatLng,
            markerLatLng,
          );
          console.log(`distance: ${distance}`);
          if (distance < maxDistance) {
            return {
              latLng: markerLatLng,
            };
          }
        }

        function isMarker(layer: Layer): layer is Marker {
          return typeof (layer as Marker).getLatLng === "function";
        }
      },
      { targetLatLng, maxDistance },
    );

    if (foundMarker) {
      return foundMarker;
    }

    await page.waitForTimeout(100);
  }
}
