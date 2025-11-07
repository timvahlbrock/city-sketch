"use client";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLng } from "@/app/components/map/latLng";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {
  pushMarkerAdded,
  pushMarkerMoved,
} from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";
import { RankedNode } from "@/app/hooks/rankedNodes";

export interface DraggableLineProps {
  nodes: RankedNode[];
  dataId: number;
}
export default function DraggableLine({ nodes, dataId }: DraggableLineProps) {
  const [markers, setMarkers] = useState<RankedNode[]>(nodes);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    setMarkers(nodes);
  }, [nodes]);

  const points = markers
    .map((marker) => ({
      lat: marker.latitude,
      lng: marker.longitude,
    }))
    .concat(mousePosition && isAdding ? [mousePosition] : []);

  function markerUpdate(index: number, newPosition: LatLng) {
    const node = markers[index];
    pushMarkerMoved(node.id, {
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
    setMarkers((markers) =>
      markers.map((marker, i) =>
        i === index
          ? {
              id: node.id,
              latitude: newPosition.lat,
              longitude: newPosition.lng,
              rank: node.rank,
            }
          : marker,
      ),
    );
  }

  async function addMarkerAtIndex(index: number, newPosition: LatLng) {
    const prevMarker = markers[index - 1];
    const nextMarker = markers[index];

    let rank;
    if (prevMarker && nextMarker) {
      rank = prevMarker.rank + (nextMarker.rank - prevMarker.rank) / 2;
    } else if (prevMarker) {
      rank = prevMarker.rank + 1;
    } else {
      rank = nextMarker.rank / 2;
    }
    const newNode = await pushMarkerAdded(dataId, rank, newPosition);

    setMarkers((markers) => {
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
          addMarker={(newPosition) =>
            addMarkerAtIndex(markers.length, newPosition)
          }
        />
      )}
      {markers.map((position, idx) => (
        <DraggableMarker
          isDraggable={!isAdding}
          key={idx}
          initialPosition={{
            lat: position.latitude,
            lng: position.longitude,
          }}
          onMarkerUpdate={(newPosition) => {
            markerUpdate(idx, newPosition);
          }}
        />
      ))}
      <SplinePolyline
        basePoints={points}
        onClick={(precedingMarkerIndex, clickedPosition) =>
          addMarkerAtIndex(precedingMarkerIndex + 1, clickedPosition)
        }
      />
      ;
    </>
  );
}

function TrackMousePosition(props: {
  setPosition: (markers: LatLng | null) => void;
}) {
  useMapEvents({
    mousemove(e) {
      props.setPosition(e.latlng);
    },
  });
  return null;
}

function AddMarkerOnClick(props: { addMarker: (marker: LatLng) => void }) {
  useMapEvents({
    click(e) {
      props.addMarker(e.latlng);
    },
  });
  return null;
}
