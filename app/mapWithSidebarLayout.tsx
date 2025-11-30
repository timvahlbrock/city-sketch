"use client";

import { Splitter } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { MapContext } from "@/app/contexts/map/mapContext";

const DynamicMap = dynamic(() => import("./@map/components/map"), {
  ssr: false,
});

export default function MapWithSidebarLayout({
  children,
  map: mapChildren,
}: {
  children: ReactNode;
  map: ReactNode;
}) {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical",
  );

  useEffect(() => {
    setOrientation(
      window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
    );
  }, []);

  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    console.log("mapRef", map);
  }, [map]);

  return (
    <Splitter
      layout={orientation}
      className={"h-full"}
      onResize={() => map?.invalidateSize({ pan: true })}
    >
      <Splitter.Panel defaultSize={"70%"}>
        <DynamicMap setMap={setMap}>{mapChildren}</DynamicMap>
      </Splitter.Panel>
      <Splitter.Panel className={"bg-white"}>
        <MapContext value={map}>
          <div style={{ padding: "16px" }}>{children}</div>
        </MapContext>
      </Splitter.Panel>
    </Splitter>
  );
}
