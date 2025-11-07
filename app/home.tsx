"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import {
  Button,
  Card,
  Checkbox,
  CheckboxChangeEvent,
  Splitter,
  Radio,
} from "antd";
import { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { Layer } from "@/app/layers";
import { addSection } from "@/app/addSection";

export interface HomeProps {
  layers: Layer[];
}

const DynamicMap = dynamic(() => import("./components/map/map"), {
  ssr: false,
});

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

  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    layers.map((layer) => layer.id),
  );

  const onLayerCheckChanged = (e: CheckboxChangeEvent, layerId: string) => {
    if (e.target.checked) {
      setSelectedLayers([...selectedLayers, layerId]);
    } else {
      setSelectedLayers(selectedLayers.filter((id) => id !== layerId));
    }
  };

  const activeLayers = layers
    .filter((layer) => selectedLayers.includes(layer.id))
    .map((layer) => layer.element);

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
          <DynamicMap ref={mapRef} isAdding={false}>
            {activeLayer?.element}
          </DynamicMap>
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
