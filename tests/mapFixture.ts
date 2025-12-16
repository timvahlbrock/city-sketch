import { Page } from "@playwright/test";
import { Layer } from "leaflet";
import { installMapHelper } from "@/tests/mapHelper";

interface SimpleLatLng {
  lat: number;
  lng: number;
}

export class MapFixture {
  public readonly ready: Promise<void>;
  public constructor(private readonly page: Page) {
    this.ready = installMapHelper(page);
  }

  public async getBounds(): Promise<{
    east: number;
    west: number;
    center: SimpleLatLng;
  }> {
    return this.page.evaluate(() => {
      return window.mapHelper.withMap((map) => {
        const bounds = map.getBounds();
        return {
          east: bounds.getEast(),
          west: bounds.getWest(),
          center: {
            lat: bounds.getCenter().lat,
            lng: bounds.getCenter().lng,
          },
        };
      });
    });
  }

  public async findMarkerAt(
    targetLatLng: SimpleLatLng,
    options: {
      maxDistance?: number;
    } = {},
  ): Promise<SimpleLatLng> {
    const { maxDistance = 10 } = options;
    return this.page.evaluate(
      async ({ targetLatLng, maxDistance }) => {
        const marker = await window.mapHelper.findMarker((marker) => {
          const markerLatLng = marker.getLatLng();
          const distance = window.leafletMap!.distance(
            targetLatLng,
            markerLatLng,
          );
          return distance < maxDistance;
        });

        const markerLatLng = marker.getLatLng();
        return {
          lat: markerLatLng.lat,
          lng: markerLatLng.lng,
        };
      },
      { targetLatLng, maxDistance },
    );
  }

  public async findLineThrough(
    pointsToGoThrough: SimpleLatLng[],
    options: {
      maxDistance?: number;
      timeout?: number;
    } = {},
  ): Promise<SimpleLatLng[]> {
    const { maxDistance = 10, timeout } = options;

    return this.retryUntilTimeout(async () => {
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
    }, timeout);
  }

  private async retryUntilTimeout<T>(
    fn: () => Promise<T | undefined>,
    timeout: number = 5000,
    interval: number = 100,
  ): Promise<T> {
    const start = Date.now();
    while (true) {
      const result = await fn();
      if (result !== undefined) {
        return result;
      }
      if (Date.now() - start > timeout) {
        throw new Error("Timeout while retrying function");
      }
      await this.page.waitForTimeout(interval);
    }
  }
}
