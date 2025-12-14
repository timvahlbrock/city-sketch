import test, { expect, Page } from "@playwright/test";
import { type Layer, type Marker, type Polyline } from "leaflet";

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
      expect(await findMarker(page, point)).toBeDefined(),
    ),
  );
  expect(await findLineThrough(page, points)).toBeDefined();
});

async function getMapBounds(page: Page) {
  while (true) {
    const bounds = await page.evaluate(() => {
      if (!window.leafletMap) {
        console.log("leafletMap is not loaded");
        return undefined;
      }
      console.log("leafletMap is loaded");
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

async function findLineThrough(
  page: Page,
  pointsToGoThrough: { lat: number; lng: number }[],
  maxDistance: number = 10,
) {
  while (true) {
    const line = await page.evaluate(
      ({ pointsToGoThrough, maxDistance }) => {
        const layers: Layer[] = [];
        window.leafletMap?.eachLayer((layer) => layers.push(layer));
        for (const layer of layers) {
          if (!isPolyline(layer)) continue;

          const polylineLatLngs = layer.getLatLngs().flat(2);
          const everyPasses = pointsToGoThrough.every((point) =>
            polylineLatLngs.find(
              (latLng) =>
                window.leafletMap!.distance(point, latLng) < maxDistance,
            ),
          );
          if (everyPasses) {
            return {
              latLng: polylineLatLngs,
            };
          }
        }

        function isPolyline(layer: Layer): layer is Polyline {
          return typeof (layer as Polyline).getLatLngs === "function";
        }
      },
      { pointsToGoThrough, maxDistance },
    );

    if (line) {
      return line;
    }

    await page.waitForTimeout(100);
  }
}
