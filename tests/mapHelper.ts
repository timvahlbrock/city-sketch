import { Layer, Map as LeafletMap, Marker, Polyline } from "leaflet";
import { Page } from "@playwright/test";

export interface IMapHelper {
  withMap<T>(callback: (map: LeafletMap) => T): Promise<T>;
  findLayer(filter: (layer: Layer) => boolean): Promise<Layer>;
  findMarker(filter: (layer: Marker) => boolean): Promise<Marker>;
  findPolyline(filter: (layer: Polyline) => boolean): Promise<Polyline>;
  waitFor(condition: (layers: Layer[]) => boolean): Promise<void>;
}

export async function installMapHelper(page: Page) {
  page.on("load", () => {
    page.evaluate(() => {
      class MapHelper implements IMapHelper {
        private leafletMap: LeafletMap | null = null;

        private mapWaiters = new Set<(mal: LeafletMap) => void>();

        private layerListeners = new Set<(layer: Layer[]) => boolean>();

        public constructor() {
          this.mapWaiters.add((map) => {
            // we do get the added or removed layer passed here, but the number of layers got out of sync anyway
            // so instead we just refetch the layers when an event is fired
            map.on("layeradd", () => {
              this.runLayerListeners();
            });
            map.on("layerremove", () => {
              this.runLayerListeners();
            });
          });

          this.checkProxyLeafletMapProp();
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
          return new Promise((res) => {
            this.waitFor((layers) => {
              for (const layer of layers) {
                if (filter(layer)) {
                  res(layer);
                  return true;
                }
              }
              return false;
            });
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

        public findPolyline(
          filter: (layer: Polyline) => boolean,
        ): Promise<Polyline> {
          function isPolyline(layer: Layer): layer is Polyline {
            return typeof (layer as Polyline).getLatLngs === "function";
          }

          return this.findLayer((layer) => {
            if (!isPolyline(layer)) return false;
            return filter(layer);
          }) as Promise<Polyline>;
        }

        public waitFor(condition: (layers: Layer[]) => boolean): Promise<void> {
          if (condition(this.getLayers())) {
            return Promise.resolve();
          }

          return new Promise((res) => {
            const query = (layers: Layer[]) => {
              const result = condition(layers);
              if (result) {
                res();
              }
              return result;
            };
            this.layerListeners.add(query);
          });
        }

        private getLayers() {
          const layers: Layer[] = [];
          this.leafletMap?.eachLayer((layer) => layers.push(layer));
          return layers;
        }

        private runLayerListeners() {
          const layers = this.getLayers();
          for (const query of this.layerListeners) {
            const result = query(layers);
            if (result) {
              this.layerListeners.delete(query);
              break;
            }
          }
        }

        private checkProxyLeafletMapProp() {
          if (window.leafletMap) {
            this.setMap(window.leafletMap);
          } else {
            this.proxyLeafletMapProp();
          }
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
