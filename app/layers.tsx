import useRemoteGeoJson from "@/app/hooks/useRemoteGeoJson";
import ExistingBusNetwork from "@/app/components/map/existingBusNetwork/existingBusNetwork";
import EditableLine from "@/app/components/map/EditableLine";
import { Suspense } from "react";

export function useLayers() {
  const busData = useRemoteGeoJson("/data/bocholt-busse.geojson");

  if (busData) {
    return {
      loaded: true,
      data: [
        {
          id: "existing-bus-network",
          label: "Bestehendes Busnetz",
          element: (
            <ExistingBusNetwork
              key={"existing-bus-network"}
              network={busData}
            />
          ),
        },
        {
          id: "custom-line",
          label: "Eigene Linie",
          element: (
            <Suspense fallback={null} key={"ring-line"}>
              <EditableLine dataId={"ring-line"} />
            </Suspense>
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
