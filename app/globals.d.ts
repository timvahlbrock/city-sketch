import * as Leaflet from "leaflet";

declare global {
  interface Window {
    leafletMap?: Leaflet.Map;
    leaflet?: Leaflet;
  }
}
