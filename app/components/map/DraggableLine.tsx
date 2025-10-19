"use client";
import { useState } from "react";
import { Polyline, useMapEvents } from "react-leaflet";
import {
  LatLng,
  type LeafletEventHandlerFnMap,
  LeafletMouseEvent,
} from "leaflet";
import DraggableMarker from "@/app/components/map/draggableMarker";
import {
  getIndexOfLinePointClosestTo,
  getPrecedingMarkerIndex,
} from "@/app/components/map/getUpdatedMarkers";
import leafletSpline, { SplinePoint } from "@/app/components/map/leafletSpline";
import { FeatureCollection, LineString } from "geojson";
import {
  pushMarkerAdded,
  pushMarkerMoved,
} from "@/app/components/map/serverActions";

export interface DraggableLineProps {
  initialMarkers: FeatureCollection;
  isAdding: boolean;
  dataId: string;
}
export default function DraggableLine({
  initialMarkers,
  isAdding,
  dataId,
}: DraggableLineProps) {
  const resolvedMarkers =
    (initialMarkers.features[0].geometry as LineString)?.coordinates.map(
      (coord: number[]) => new LatLng(coord[1], coord[0]),
    ) ?? [];
  const [markers, setMarkers] = useState<LatLng[]>(resolvedMarkers);
  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);

  let spline: SplinePoint[] = [];
  const points = markers.concat(
    mousePosition && isAdding ? [mousePosition] : [],
  );
  if (points.length >= 2) {
    spline = leafletSpline(points);
  }

  function markerUpdate(index: number, newPosition: LatLng) {
    pushMarkerMoved(dataId, index, {
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
    setMarkers((markers) =>
      markers.map((marker, i) => (i === index ? newPosition : marker)),
    );
  }

  const eventHandlers: LeafletEventHandlerFnMap = {
    click: (e: LeafletMouseEvent) => {
      const closestIndex = getIndexOfLinePointClosestTo(
        spline.map((entry) => {
          return entry.latLng;
        }),
        e.latlng,
      );
      if (closestIndex === -1) {
        alert("Could not find clicked point in spline");
        return markers;
      }

      const precedingMarkerIndex = getPrecedingMarkerIndex(
        spline,
        closestIndex,
      );
      if (precedingMarkerIndex === -1) {
        alert("Could not find preceding marker");
        return markers;
      }

      pushMarkerAdded(dataId, precedingMarkerIndex + 1, {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });

      const newMarkers = [...markers];
      newMarkers.splice(precedingMarkerIndex + 1, 0, e.latlng);
      setMarkers(newMarkers);
    },
  };

  return (
    <>
      <TrackMousePosition setPosition={setMousePosition} />
      {isAdding && <AddMarkerOnClick setMarkers={setMarkers} />}
      {markers.map((position, idx) => (
        <DraggableMarker
          isDraggable={!isAdding}
          key={idx}
          initialPosition={position}
          onMarkerUpdate={(newPosition) => {
            markerUpdate(idx, newPosition);
          }}
        />
      ))}
      <Polyline
        positions={spline.map((entry) => entry.latLng)}
        pathOptions={{ color: "blue", weight: 5 }}
        eventHandlers={eventHandlers}
      ></Polyline>
      ;
    </>
  );
}

function TrackMousePosition(props: {
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
}) {
  useMapEvents({
    mousemove(e) {
      props.setPosition(e.latlng);
    },
  });
  return null;
}

function AddMarkerOnClick(props: {
  setMarkers: React.Dispatch<React.SetStateAction<LatLng[]>>;
}) {
  useMapEvents({
    click(e) {
      props.setMarkers((markers) => [...markers, e.latlng]);
    },
  });
  return null;
}
