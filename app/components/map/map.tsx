"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { PropsWithChildren, RefObject, useRef } from "react";
import { Map as LeafletMap } from "leaflet";

export interface MapProps {
  isAdding: boolean;
  ref: RefObject<LeafletMap | null>;
}

export default function Map(props: PropsWithChildren<MapProps>) {
  return (
    <MapContainer
      ref={props.ref}
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
