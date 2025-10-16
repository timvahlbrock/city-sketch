'use client';

import dynamic from 'next/dynamic';
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useEffect, useState} from "react";
import {Card, Checkbox, CheckboxChangeEvent, Space, Splitter} from "antd";
import {useLayers} from "@/app/layers";

const DynamicMap = dynamic(() => import('./components/map/map'), {ssr: false});

export default function Home() {
    const [isAdding, setIsAdding] = useState(false)

    const dividerOrientation = window.innerWidth > window.innerHeight ? "horizontal" : "vertical";
    const layers = useLayers();

    const [selectedLayers, setSelectedLayers] = useState<string[]>(layers.data.map(layer => layer.id));

    useEffect(() => {
        if(layers.loaded) {
            setSelectedLayers(layers.data.map(layer => layer.id));
        }
    }, [layers.loaded]);

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
        <Fab
            onClick={() => setIsAdding(!isAdding)}
            color={isAdding ? "secondary" : "primary"}
            style={{
                position: 'absolute',
                bottom: "1rem",
                right: "1rem",
            }}>
            <AddIcon/>
        </Fab>
        <Splitter layout={dividerOrientation} className={"h-full"}>
            <Splitter.Panel>
                <DynamicMap
                    isAdding={isAdding}>
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
