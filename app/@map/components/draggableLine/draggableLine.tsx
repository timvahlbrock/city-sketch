"use client";
import { useContext, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import DraggableMarker from "@/app/@map/components/draggableMarker";
import SplinePolyline from "@/app/@map/components/SplinePolyline";
import { RankedNode, toLatLng } from "@/app/types/rankedNodes";
import { divIcon, LatLng, Map as LeafletMap, point } from "leaflet";
import { TrackMousePosition } from "@/app/@map/components/trackMousePosition";
import leafletSpline from "@/app/@map/components/leafletSpline";
import { renderToString } from "react-dom/server";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import EditorContext from "@/app/contexts/editorContext/editorContext";
import { Modal } from "antd";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface DraggableLineProps {
  serverNodes: RankedNode[];
  sectionId: Id<"sections">;
  isEditable: boolean;
}

const plusIcon = divIcon({
  html: renderToString(
    <PlusCircleOutlined style={{ fontSize: "x-large", color: "green" }} />,
  ),
  className: "icon",
});

export default function DraggableLine({
  serverNodes,
  sectionId,
  isEditable,
}: DraggableLineProps) {
  const createNode = useMutation(api.nodes.create);
  const updateNodePositionRemote = useMutation(api.nodes.updatePosition);
  const removeNodeRemote = useMutation(api.nodes.deleteNode);
  const editorState = useContext(EditorContext).state;
  const removeSectionMutation = useMutation(api.sections.del);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [draggedNode, setDraggedNode] = useState<RankedNode | null>(null);

  const nodes = serverNodes.map((node) =>
    node._id === draggedNode?._id ? draggedNode : node,
  );

  const [mousePosition, setMousePosition] = useState<LatLng | null>(null);
  const [addingLocation, setAddingLocation] = useState<"start" | "end" | null>(
    null,
  );
  const isAdding = addingLocation !== null;

  const latLngNodes = nodes.map((node) => toLatLng(node));
  let points = latLngNodes;
  if (mousePosition && addingLocation === "start") {
    points = [mousePosition, ...latLngNodes];
  } else if (mousePosition && addingLocation === "end") {
    points = [...latLngNodes, mousePosition];
  }

  function handleMarkerDrag(index: number, newPosition: LatLng) {
    const node = nodes[index];
    const newNode = {
      ...node,
      latitude: newPosition.lat,
      longitude: newPosition.lng,
    };

    setDraggedNode(newNode);
  }

  async function handleMarkerDragend(index: number, newPosition: LatLng) {
    const node = nodes[index];
    await updateNodePositionRemote({
      nodeId: node._id,
      latitude: newPosition.lat,
      longitude: newPosition.lng,
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

    await createNode({
      sectionId,
      rank,
      latitude: newPosition.lat,
      longitude: newPosition.lng,
    });

    setAddingLocation(null);
  }

  async function handleMarkerRemove(index: number) {
    const node = nodes[index];
    await removeNodeRemote({ nodeId: node._id });
  }

  async function deleteSection(sectionId: Id<"sections">) {
    await removeSectionMutation({ sectionId });
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
      {isAdding && <TrackMousePosition setPosition={setMousePosition} />}
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
      {isEditable &&
        nodes.map((position, idx) => (
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
          if (!isEditable) return;
          if (isAdding) {
            return;
          }
          if (editorState?.stateType == "addingNode") {
            addNodeAtIndex(precedingMarkerIndex + 1, clickedPosition);
          } else if (editorState?.stateType == "removeSection") {
            setDeleteModalOpen(true);
          }
        }}
      />
      <Modal
        title={"Delete sections?"}
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={async () => {
          await deleteSection(sectionId);
          setDeleteModalOpen(false);
        }}
        okText={"Delete"}
        okButtonProps={{
          icon: <DeleteOutlined />,
          variant: "solid",
          color: "danger",
        }}
      >
        Are you sure you want to delete this section? This cannot be undone.
      </Modal>
      {isEditable && !isAdding && endPlusIconPoint && (
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
      {isEditable && !isAdding && startPlusIconPoint && (
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
