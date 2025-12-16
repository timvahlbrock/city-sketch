import { Page } from "@playwright/test";
import type { Layer, Marker } from "leaflet";

interface SimpleLatLng {
  lat: number;
  lng: number;
}

export class MapFixture {
  constructor(private readonly page: Page) {}

  public async getBounds(options: { timeout?: number } = {}): Promise<{
    east: number;
    west: number;
    center: SimpleLatLng;
  }> {
    const { timeout = 5000 } = options;
    const start = Date.now();
    while (true) {
      const bounds = await this.page.evaluate(() => {
        if (!window.leafletMap) {
          return undefined;
        }

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

      if (bounds) {
        return bounds;
      }

      if (Date.now() - start > timeout) {
        throw new Error("Timeout while getting map bounds");
      }

      await this.page.waitForTimeout(100);
    }
  }

  public async findMarkerAt(
    targetLatLng: SimpleLatLng,
    options: {
      maxDistance?: number;
      timeout?: number;
    } = {},
  ): Promise<SimpleLatLng> {
    const { maxDistance = 10, timeout = 5000 } = options;
    const start = Date.now();

    while (true) {
      const marker = await this.page.evaluate(
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

      if (marker) {
        return {
          lat: marker.latLng.lat,
          lng: marker.latLng.lng,
        };
      }

      if (Date.now() - start > timeout) {
        throw new Error("Timeout while searching for marker");
      }

      await this.page.waitForTimeout(100);
    }
  }

  public async findLineThrough(
    pointsToGoThrough: SimpleLatLng[],
    options: {
      maxDistance?: number;
      timeout?: number;
    } = {},
  ): Promise<SimpleLatLng[]> {
    const { maxDistance = 10, timeout = 5000 } = options;
    const start = Date.now();

    while (true) {
      const line = await this.page.evaluate(
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

          function isPolyline(layer: Layer): layer is L.Polyline {
            return typeof (layer as L.Polyline).getLatLngs === "function";
          }
        },
        { pointsToGoThrough, maxDistance },
      );

      if (line) {
        return line.latLng.map((latLng: L.LatLng) => ({
          lat: latLng.lat,
          lng: latLng.lng,
        }));
      }

      if (Date.now() - start > timeout) {
        throw new Error("Timeout while searching for line");
      }

      await this.page.waitForTimeout(100);
    }
  }
}
