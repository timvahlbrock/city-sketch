"use server";
import DraggableLine from "@/app/components/map/DraggableLine";
import path from "path";
import * as fs from "node:fs/promises";
import { FeatureCollection } from "geojson";

export interface EditableLineProps {
  dataId: string;
}

export default async function EditableLine({ dataId }: EditableLineProps) {
  const filePath = path.resolve(process.cwd(), "data", `${dataId}.geojson`);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as FeatureCollection;

  return (
    <DraggableLine initialMarkers={data} isAdding={false} dataId={dataId} />
  );
}
