"use server";
import ExistingBusNetwork from "@/app/components/map/existingBusNetwork/existingBusNetwork";
import EditableLine from "@/app/components/map/EditableLine";
import { ReactNode, Suspense } from "react";
import * as fs from "node:fs/promises";

export interface Layer {
  id: string;
  label: string;
  element: ReactNode;
}

export async function getLayers(): Promise<Layer[]> {
  const busData = await fs
    .readFile(
      process.cwd() + "/public/data/existing-bus-network.geojson",
      "utf-8",
    )
    .then((data) => JSON.parse(data))
    .catch(() => null);
  return [
    {
      id: "existing-bus-network",
      label: "Bestehendes Busnetz",
      element: (
        <ExistingBusNetwork key={"existing-bus-network"} network={busData} />
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
  ];
}
