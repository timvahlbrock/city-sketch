import { Page } from "@playwright/test";
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
    } = {},
  ): Promise<SimpleLatLng[]> {
    const { maxDistance = 10 } = options;

    return this.page.evaluate(
      async ({ pointsToGoThrough, maxDistance }) => {
        const polyline = await window.mapHelper.findPolyline((polyline) => {
          const polylineLatLngs = polyline.getLatLngs().flat(2);
          return pointsToGoThrough.every((point) =>
            polylineLatLngs.find(
              (latLng) =>
                window.leafletMap!.distance(point, latLng) < maxDistance,
            ),
          );
        });

        return polyline
          .getLatLngs()
          .flat(2)
          .map((latLng) => ({
            lat: latLng.lat,
            lng: latLng.lng,
          }));
      },
      { pointsToGoThrough, maxDistance },
    );
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
