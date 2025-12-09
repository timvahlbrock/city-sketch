"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PropsWithChildren } from "react";
import * as Leaflet from "leaflet";

export type MapProps = PropsWithChildren<{
  setMap?: (map: Leaflet.Map | null) => void;
}>;

export default function Map(props: MapProps) {
  return (
    <MapContainer
      ref={(ref) => {
        const env = process.env.NODE_ENV;
        if (env === "development" && ref) {
          window.leafletMap = ref;
          window.leaflet = Leaflet;
        }
        props.setMap?.(ref);
      }}
      center={[51.83692, 6.61892]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  );
}
