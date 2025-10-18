'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from "react";
import {Card, Checkbox, CheckboxChangeEvent, Splitter} from "antd";
import {useLayers} from "@/app/layers";

const DynamicMap = dynamic(() => import('./components/map/map'), {ssr: false});

export default function Home() {
    const dividerOrientation = window.innerWidth > window.innerHeight ? "horizontal" : "vertical";
    const layers = useLayers();

    const [selectedLayers, setSelectedLayers] = useState<string[]>(layers.data.map(layer => layer.id));

    useEffect(() => {
        if(layers.loaded) {
            setSelectedLayers(layers.data.map(layer => layer.id));
        }
    }, [layers.loaded, layers.data]);

    const onLayerCheckChanged = (e: CheckboxChangeEvent, layerId: string) => {
        if (e.target.checked) {
            setSelectedLayers([...selectedLayers, layerId]);
        } else {
            setSelectedLayers(selectedLayers.filter(id => id !== layerId));
        }
    };

    const activeLayers = layers.data
        .filter(layer => selectedLayers.includes(layer.id))
        .map(layer => layer.element);

    return <>
        <Splitter layout={dividerOrientation} className={"h-full"}>
            <Splitter.Panel defaultSize={"70%"}>
                <DynamicMap
                    isAdding={false}>
                    {activeLayers}
                </DynamicMap>;
            </Splitter.Panel>
            <Splitter.Panel className={"bg-white"}>
                <Card className={"w-full"} title={"Layer"}>
                    {layers.data.map(layer =>
                        <><Checkbox
                            checked={selectedLayers.includes(layer.id)}
                            key={layer.id}
                            onChange={e => onLayerCheckChanged(e, layer.id)}
                        >
                            {layer.label}
                        </Checkbox><br/></>
                    )}
                </Card>
            </Splitter.Panel>
        </Splitter>
    </>;
}
