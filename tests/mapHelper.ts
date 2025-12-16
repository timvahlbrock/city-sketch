import { Layer, Map as LeafletMap, Marker } from "leaflet";
import { Page } from "@playwright/test";

export interface IMapHelper {
  withMap<T>(callback: (map: LeafletMap) => T): Promise<T>;
  findLayer(filter: (layer: Layer) => boolean): Promise<Layer>;
  findMarker(filter: (layer: Marker) => boolean): Promise<Marker>;
}

export async function installMapHelper(page: Page) {
  page.on("load", () => {
    page.evaluate(() => {
      class MapHelper implements IMapHelper {
        private leafletMap: LeafletMap | null = null;

        private mapWaiters = new Set<(mal: LeafletMap) => void>();

        private layers: Layer[] = [];

        private layerQueries = new Set<(layer: Layer) => boolean>();

        public constructor() {
          this.mapWaiters.add((map) => {
            map.on("layeradd", (event) => {
              this.layers.push(event.layer);
              for (const query of this.layerQueries) {
                const result = query(event.layer);
                if (result) {
                  this.layerQueries.delete(query);
                }
              }
            });
            map.on("layerremove", (event) => {
              const index = this.layers.indexOf(event.layer);
              if (index !== -1) {
                this.layers.splice(index, 1);
              } else {
                console.warn(
                  "Removed layer not found in layers array",
                  event.layer,
                );
              }
            });
          });

          this.proxyLeafletMapProp();
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

        public findLayer(filter: (layer: Layer) => boolean): Promise<Layer> {
          for (const layer of this.layers) {
            if (filter(layer)) {
              return Promise.resolve(layer);
            }
          }

          return new Promise((res) => {
            const query = (layer: Layer) => {
              const result = filter(layer);
              if (result) {
                res(layer);
              }
              return result;
            };
            this.layerQueries.add(query);
          });
        }

        public findMarker(filter: (layer: Marker) => boolean): Promise<Marker> {
          function isMarker(layer: Layer): layer is Marker {
            return typeof (layer as Marker).getLatLng === "function";
          }
          return this.findLayer((layer) => {
            if (!isMarker(layer)) return false;
            return filter(layer);
          }) as Promise<Marker>;
        }

        private proxyLeafletMapProp() {
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

        private setMap(map: LeafletMap) {
          this.leafletMap = map;
          for (const waiter of this.mapWaiters) {
            waiter(map);
            this.mapWaiters.delete(waiter);
          }
        }
      }

      if (!window.mapHelper) {
        window.mapHelper = new MapHelper();
      }
    });
  });
}
