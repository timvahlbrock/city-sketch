import useRemoteGeoJson from "@/app/hooks/useRemoteGeoJson";
import ExistingBusNetwork from "@/app/components/map/existingBusNetwork/existingBusNetwork";
import { DraggableLine } from "@/app/components/map/DraggableLine";
import { LatLng } from "leaflet";

export function useLayers() {
  const busData = useRemoteGeoJson("/data/bocholt-busse.geojson");

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
            <DraggableLine
              initialMarkers={[
                new LatLng(51.82, 6.6),
                new LatLng(51.83, 6.6),
                new LatLng(51.85, 6.6),
                new LatLng(51.83, 6.61),
                new LatLng(51.825, 6.61),
                new LatLng(51.825, 6.6), // the marker on the intersection
                new LatLng(51.825, 6.58),
              ]}
              isAdding={false}
            />
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
