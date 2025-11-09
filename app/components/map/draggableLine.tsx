"use client";
import { useEffect, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {
  pushMarkerAdded,
  pushMarkerMoved,
  pushMarkerRemoved,
} from "@/app/components/map/serverActions";
import SplinePolyline from "@/app/components/map/SplinePolyline";
import { RankedNode, toLatLng } from "@/app/types/rankedNodes";
import { divIcon, LatLng, Map as LeafletMap, point } from "leaflet";
import { TrackMousePosition } from "@/app/components/map/trackMousePosition";
import leafletSpline from "@/app/components/map/leafletSpline";
import { renderToString } from "react-dom/server";
import { PlusCircleOutlined } from "@ant-design/icons";

export interface DraggableLineProps {
  initialNodes: RankedNode[];
  dataId: number;
}

const plusIcon = divIcon({
  html: renderToString(
    <PlusCircleOutlined style={{ fontSize: "x-large", color: "green" }} />,
  ),
  className: "icon",
});

export default function DraggableLine({
  initialNodes,
  dataId,
}: DraggableLineProps) {
  const [nodes, setNodes] = useState<RankedNode[]>(initialNodes);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
  const [addingLocation, setAddingLocation] = useState<"start" | "end" | null>(
    null,
  );
  const isAdding = addingLocation !== null;

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const latLngNodes = nodes.map((node) => toLatLng(node));
  let points = latLngNodes;
  if (mousePosition && addingLocation === "start") {
    points = [mousePosition, ...latLngNodes];
  } else if (mousePosition && addingLocation === "end") {
    points = [...latLngNodes, mousePosition];
  }

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
    setAddingLocation(null);
  }

  async function handleMarkerRemove(index: number) {
    const node = nodes[index];
    await pushMarkerRemoved(node.id);
    setNodes((markers) => {
      const newMarkers = [...markers];
      newMarkers.splice(index, 1);
      return newMarkers;
    });
  }

  const spline =
    points.length > 2
      ? leafletSpline(points.map((point) => new LatLng(point.lat, point.lng)))
      : [];

  const map = useMap();

  const endPlusIconPoint =
    spline.length > 2
      ? getPlusIconPoint(
          map,
          spline.map((p) => new LatLng(p.latLng.lat, p.latLng.lng)),
          24,
          false,
        )
      : null;

  const startPlusIconPoint =
    spline.length > 2
      ? getPlusIconPoint(
          map,
          spline.map((p) => new LatLng(p.latLng.lat, p.latLng.lng)),
          24,
          true,
        )
      : null;
  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      {isAdding && (
        <AddMarkerOnClick
          addMarker={(newPosition) =>
            addNodeAtIndex(
              addingLocation == "start" ? 0 : nodes.length,
              newPosition,
            )
          }
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
          onMarkerRemove={() => handleMarkerRemove(idx)}
        />
      ))}
      <SplinePolyline
        spline={spline}
        onClick={(precedingMarkerIndex, clickedPosition) => {
          if (isAdding) {
            return;
          }
          addNodeAtIndex(precedingMarkerIndex + 1, clickedPosition);
        }}
      />
      {!isAdding && endPlusIconPoint && (
        <Marker
          position={endPlusIconPoint}
          icon={plusIcon}
          eventHandlers={{
            click(e) {
              setAddingLocation("end");
            },
          }}
        />
      )}
      {!isAdding && startPlusIconPoint && (
        <Marker
          position={startPlusIconPoint}
          icon={plusIcon}
          eventHandlers={{
            click(e) {
              setAddingLocation("start");
            },
          }}
        />
      )}
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

// Implementation from DraggableLines.ts of https://github.com/FacilMap/Leaflet.DraggableLines
function getPlusIconPoint(
  map: LeafletMap,
  trackPoints: LatLng[],
  distance: number,
  atStart: boolean,
) {
  const tr = atStart ? trackPoints : [...trackPoints].reverse();

  const point0 = map.latLngToContainerPoint(tr[0]);
  const tr1 = tr.find(
    (p, i) => i > 0 && point0.distanceTo(map.latLngToContainerPoint(p)) > 0,
  );

  let result;
  if (!tr1) {
    result = point(point0.x + (atStart ? -1 : 1) * distance, point0.y);
  } else {
    const point1 = map.latLngToContainerPoint(tr1);

    const fraction = distance / point0.distanceTo(point1);

    result = point(
      point0.x - fraction * (point1.x - point0.x),
      point0.y - fraction * (point1.y - point0.y),
    );
  }

  return map.containerPointToLatLng(result);
}
