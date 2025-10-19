"use client";

import { useRef, useState } from "react";
import { Card, Checkbox, CheckboxChangeEvent, Splitter } from "antd";
import { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { Layer } from "@/app/layers";

export interface HomeProps {
  layers: Layer[];
}

const DynamicMap = dynamic(() => import("./components/map/map"), {
  ssr: false,
});

export default function Home({ layers }: HomeProps) {
  const dividerOrientation =
    window.innerWidth > window.innerHeight ? "horizontal" : "vertical";

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

  return (
    <>
      <Splitter
        layout={dividerOrientation}
        className={"h-full"}
        onResize={() => mapRef.current?.invalidateSize({ pan: true })}
      >
        <Splitter.Panel defaultSize={"70%"}>
          <DynamicMap ref={mapRef} isAdding={false}>
            {activeLayers}
          </DynamicMap>
          ;
        </Splitter.Panel>
        <Splitter.Panel className={"bg-white"}>
          <Card className={"w-full"} title={"Layer"}>
            {layers.map((layer) => {
              console.log(
                layer.label + " " + selectedLayers.includes(layer.id),
              );
              return (
                <span key={layer.id}>
                  <Checkbox
                    checked={selectedLayers.includes(layer.id)}
                    key={layer.id}
                    onChange={(e) => onLayerCheckChanged(e, layer.id)}
                  >
                    {layer.label}
                  </Checkbox>
                  <br />
                </span>
              );
            })}
          </Card>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}
