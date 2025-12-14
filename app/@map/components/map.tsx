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
  function checkExposeMapRef(ref: Leaflet.Map | null) {
    const isDevelopment = process.env.NODE_ENV === "development";
    const exposeTestApis =
      isDevelopment || process.env.EXPOSE_TEST_APIS === "true";

    if (!exposeTestApis) {
      console.log("Exposing test APIS is disabled");
      return;
    }

    console.log("Exposing test APIs is enabled");
    if (!ref) {
      console.log("Ref is unset. Cannot expose APIs");
      return;
    }

    window.leafletMap = ref;
    window.leaflet = Leaflet;
  }
  return (
    <MapContainer
      ref={(ref) => {
        checkExposeMapRef(ref);
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
