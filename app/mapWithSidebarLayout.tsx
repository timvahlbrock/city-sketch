"use client";

import { Splitter } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./components/map/map"), {
  ssr: false,
});

export default function MapWithSidebarLayout({
  children,
  map,
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

  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <Splitter
      layout={orientation}
      className={"h-full"}
      onResize={() => mapRef.current?.invalidateSize({ pan: true })}
    >
      <Splitter.Panel defaultSize={"70%"}>
        <DynamicMap ref={mapRef}>{map}</DynamicMap>
      </Splitter.Panel>
      <Splitter.Panel className={"bg-white"}>
        <div style={{ padding: "16px" }}>{children}</div>
      </Splitter.Panel>
    </Splitter>
  );
}
