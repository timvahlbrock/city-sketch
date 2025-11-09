"use client";

import { useEffect, useRef, useState } from "react";
import { Splitter } from "antd";
import { Map as LeafletMap } from "leaflet";
import MapComponent from "@/app/components/map/map";
import { Section } from "@/app/components/map/section";
import VisionSelection from "@/app/components/visionSelection/visionSelection";
import { useParams } from "next/navigation";

export default function Page() {
  const { visionId } = useParams();
  const sectionId = parseInt(visionId as string, 10);
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
            <Section sectionId={sectionId} />
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
