"use client";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {
  pushMarkerAdded,
  pushMarkerMoved,
} from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";
import { RankedNode, toLatLng } from "@/app/hooks/rankedNodes";
import { LatLng } from "leaflet";
import { TrackMousePosition } from "@/app/components/map/trackMousePosition";

export interface DraggableLineProps {
  initialNodes: RankedNode[];
  dataId: number;
}
export default function DraggableLine({
  initialNodes,
  dataId,
}: DraggableLineProps) {
  const [nodes, setNodes] = useState<RankedNode[]>(initialNodes);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const points = nodes
    .map((node) => toLatLng(node))
    .concat(mousePosition && isAdding ? [mousePosition] : []);

  function handleMarkerDrag(index: number, newPosition: LatLng) {
    const node = nodes[index];
    setNodes((markers) => {
      const newMarkers = [...markers];
      newMarkers[index] = {
        id: node.id,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
        rank: node.rank,
      };
      return newMarkers;
    });
  }

  async function handleMarkerDragend(index: number, newPosition: LatLng) {
    const node = nodes[index];
    await pushMarkerMoved(node.id, {
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
  }

  async function addNodeAtIndex(index: number, newPosition: LatLng) {
    const prevMarker = nodes[index - 1];
    const nextMarker = nodes[index];

    let rank;
    if (prevMarker && nextMarker) {
      rank = prevMarker.rank + (nextMarker.rank - prevMarker.rank) / 2;
    } else if (prevMarker) {
      rank = prevMarker.rank + 1;
    } else {
      rank = nextMarker.rank / 2;
    }
    const newNode = await pushMarkerAdded(dataId, rank, newPosition);

    setNodes((markers) => {
      const newMarkers = [...markers];
      newMarkers.splice(index, 0, {
        id: newNode.id,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
        rank: rank,
      });
      return newMarkers;
    });
  }

  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      {isAdding && (
        <AddMarkerOnClick
          addMarker={(newPosition) => addNodeAtIndex(nodes.length, newPosition)}
        />
      )}
      {nodes.map((position, idx) => (
        <DraggableMarker
          isDraggable={!isAdding}
          key={idx}
          position={{
            lat: position.latitude,
            lng: position.longitude,
          }}
          onMarkerUpdate={(newPosition) => {
            handleMarkerDrag(idx, newPosition);
          }}
          onMarkerUpdateEnd={(newPosition) => {
            handleMarkerDragend(idx, newPosition);
          }}
        />
      ))}
      <SplinePolyline
        basePoints={points}
        onClick={(precedingMarkerIndex, clickedPosition) =>
          addNodeAtIndex(precedingMarkerIndex + 1, clickedPosition)
        }
      />
      ;
    </>
  );
}

function AddMarkerOnClick(props: { addMarker: (marker: LatLng) => void }) {
  useMapEvents({
    click(e) {
      props.addMarker(e.latlng);
    },
  });
  return null;
}
