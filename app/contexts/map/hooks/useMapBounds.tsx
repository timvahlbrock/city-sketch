import { useContext } from "react";
import { MapContext } from "@/app/contexts/map/mapContext";

export default function useMapBounds() {
  const mapContext = useContext(MapContext);

  return mapContext?.getBounds();
}
