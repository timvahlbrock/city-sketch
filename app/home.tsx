"use client";

import { useEffect, useRef, useState } from "react";
import { Space, Splitter } from "antd";
import { Map as LeafletMap } from "leaflet";
import MapComponent from "@/app/components/map/map";
import { Section } from "@/app/components/map/section";
import VisionSelection from "@/app/components/visionSelection/visionSelection";

export type HomeProps = object;

export default function Home({}: HomeProps) {
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
    <>
      <Splitter
        layout={orientation}
        className={"h-full"}
        onResize={() => mapRef.current?.invalidateSize({ pan: true })}
      >
        <Splitter.Panel defaultSize={"70%"}>
          <MapComponent ref={mapRef}>
            <Section sectionId={1} />
          </MapComponent>
          ;
        </Splitter.Panel>
        <Splitter.Panel className={"bg-white"}>
          <div style={{ padding: "16px" }}>
            <VisionSelection />
          </div>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}
