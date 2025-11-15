import { createContext } from "react";
import { Map as LeafletMap } from "leaflet";

export const MapContext = createContext<LeafletMap | null>(null);
