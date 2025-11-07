import { LatLng } from "leaflet";
import { useMapEvents } from "react-leaflet";

export function TrackMousePosition(props: {
  setPosition: (markers: LatLng | null) => void;
}) {
  useMapEvents({
    mousemove(e) {
      props.setPosition(e.latlng);
    },
  });
  return null;
}