"use server";
import { ReactNode } from "react";
import { createClient } from "@/app/utils";
import DraggableLine from "@/app/components/map/DraggableLine";
import { Database } from "@/app/database.types";

export interface Layer {
  id: string;
  label: string;
  element: ReactNode;
}

export async function getLayers(): Promise<Layer[]> {
  const client = await createClient();

  const sections = await client
    .from("sections")
    .select(`id, nodes(latitude, longitude) ordered:rank`);

  const data = sections.data as Array<
    Database["public"]["Tables"]["sections"]["Row"] & {
      nodes: Array<Database["public"]["Tables"]["nodes"]["Row"]>;
    }
  > | null;

  if (!data) {
    return [];
  }

  return data.map((section) => {
    return {
      id: section.id + "",
      label: "Section " + section.id,
      element: (
        <DraggableLine
          isAdding={false}
          key={section.id}
          initialMarkers={section.nodes.map((node) => ({
            lat: node.latitude,
            lng: node.longitude,
          }))}
          dataId={section.id + ""}
        />
      ),
    };
  });
}
