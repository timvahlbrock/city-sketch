import { FeatureCollection } from "geojson";
import DraggableLine from "@/app/components/map/DraggableLine";
import useRemoteGeoJson from "@/app/hooks/useRemoteGeoJson";

export interface EditableLineProps {
  dataId: string;
}

export default function EditableLine({ dataId }: EditableLineProps) {
  const data = useRemoteGeoJson<FeatureCollection | null>(
    `/data/${dataId}.geojson`,
  );

  if (!data) {
    return null;
  }

  return <DraggableLine initialMarkers={data} isAdding={false} />;
}
