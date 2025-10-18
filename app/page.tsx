"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Card, Checkbox, CheckboxChangeEvent, Splitter } from "antd";
import { useLayers } from "@/app/layers";
import { Map as LeafletMap } from "leaflet";
import usePrevious from "antd/es/typography/hooks/usePrevious";

const DynamicMap = dynamic(() => import("./components/map/map"), {
  ssr: false,
});

export default function Home() {
  const dividerOrientation =
    window.innerWidth > window.innerHeight ? "horizontal" : "vertical";
  const layers = useLayers();

  const [selectedLayers, setSelectedLayers] = useState<string[]>(
    layers.data.map((layer) => layer.id),
  );

  const wasLoaded = usePrevious(layers.loaded);

  useEffect(() => {
    if (!wasLoaded && layers.loaded) {
      setSelectedLayers(layers.data.map((layer) => layer.id));
    }
  }, [layers.data, layers.loaded, selectedLayers.length, wasLoaded]);

  const onLayerCheckChanged = (e: CheckboxChangeEvent, layerId: string) => {
    if (e.target.checked) {
      setSelectedLayers([...selectedLayers, layerId]);
    } else {
      setSelectedLayers(selectedLayers.filter((id) => id !== layerId));
    }
  };

  const activeLayers = layers.data
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
            {layers.data.map((layer) => {
              console.log(
                layer.label + " " + selectedLayers.includes(layer.id),
              );
              return (
                <>
                  <Checkbox
                    checked={selectedLayers.includes(layer.id)}
                    key={layer.id}
                    onChange={(e) => onLayerCheckChanged(e, layer.id)}
                  >
                    {layer.label}
                  </Checkbox>
                  <br />
                </>
              );
            })}
          </Card>
        </Splitter.Panel>
      </Splitter>
    </>
  );
}
