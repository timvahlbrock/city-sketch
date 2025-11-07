"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card, Radio, Splitter } from "antd";
import { Map as LeafletMap } from "leaflet";
import { Layer } from "@/app/layers";
import { addSection } from "@/app/addSection";
import MapComponent from "@/app/components/map/map";

export interface HomeProps {
  layers: Layer[];
}

export default function Home({ layers }: HomeProps) {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "vertical",
  );

  const [activeLayer, setActiveLayer] = useState<Layer | null>(layers[0]);

  useEffect(() => {
    setOrientation(
      window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
    );
  }, []);

  const mapRef = useRef<LeafletMap | null>(null);

  async function handleNewSectionClick() {
    const newSection = await addSection();
    alert(`New section added with ID: ${newSection}`);
  }

  return (
    <>
      <Splitter
        layout={orientation}
        className={"h-full"}
        onResize={() => mapRef.current?.invalidateSize({ pan: true })}
      >
        <Splitter.Panel defaultSize={"70%"}>
          <MapComponent ref={mapRef} isAdding={false}>
            {activeLayer?.element}
          </MapComponent>
          ;
        </Splitter.Panel>
        <Splitter.Panel className={"bg-white"}>
          <Card className={"w-full"} title={"Layers"}>
            <Radio.Group
              value={activeLayer}
              options={layers.map((layer) => ({
                label: layer.label,
                value: layer,
                id: layer.id,
                key: layer.id,
              }))}
              onChange={(e) => setActiveLayer(e.target.value)}
            />
            <Button onClick={handleNewSectionClick} color="primary">
              Add New Section
            </Button>
          </Card>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}
