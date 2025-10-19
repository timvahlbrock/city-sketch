import useRemoteGeoJson from "@/app/hooks/useRemoteGeoJson";
import ExistingBusNetwork from "@/app/components/map/existingBusNetwork/existingBusNetwork";
import { DraggableLine } from "@/app/components/map/DraggableLine";
import { LatLng } from "leaflet";
import { LineString } from "geojson";

export function useLayers() {
  const busData = useRemoteGeoJson("/data/bocholt-busse.geojson");
  const ringLine = useRemoteGeoJson("/data/ring-line.geojson");

  const coordinates =
    (ringLine?.features[0].geometry as LineString)?.coordinates.map(
      (coord: number[]) => new LatLng(coord[1], coord[0]),
    ) ?? [];

  if (busData) {
    return {
      loaded: true,
      data: [
        {
          id: "existing-bus-network",
          label: "Bestehendes Busnetz",
          element: <ExistingBusNetwork network={busData} />,
        },
        {
          id: "custom-line",
          label: "Eigene Linie",
          element: (
            <DraggableLine initialMarkers={coordinates} isAdding={false} />
          ),
        },
      ],
    };
  }

  return {
    loaded: false,
    data: [],
  };
}
