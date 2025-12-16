import { Map as LeafletMap } from "leaflet";
import { Page } from "@playwright/test";

export interface IMapHelper {
  withMap<T>(callback: (map: LeafletMap) => T): Promise<T>;
}

export async function installMapHelper(page: Page) {
  page.on("load", () => {
    page.evaluate(() => {
      const MapHelper = class implements IMapHelper {
        private leafletMap: LeafletMap | null = null;

        private mapWaiters = new Set<(mal: LeafletMap) => void>();

        public constructor() {
          let map: LeafletMap | null = null;
          const setMap = this.setMap.bind(this);
          Object.defineProperty(window, "leafletMap", {
            get() {
              return map;
            },
            set(value: LeafletMap) {
              map = value;
              setMap(value);
            },
          });
        }

        public withMap<T>(callback: (map: LeafletMap) => T): Promise<T> {
          if (this.leafletMap) {
            return Promise.resolve(callback(this.leafletMap));
          }

          return new Promise((res) => {
            const waiter = (map: LeafletMap) => {
              return res(callback(map));
            };
            this.mapWaiters.add(waiter);
          });
        }

        private setMap(map: LeafletMap) {
          this.leafletMap = map;
          for (const waiter of this.mapWaiters) {
            waiter(map);
            this.mapWaiters.delete(waiter);
          }
        }
      };

      if (!window.mapHelper) {
        window.mapHelper = new MapHelper();
      }
    });
  });
}
