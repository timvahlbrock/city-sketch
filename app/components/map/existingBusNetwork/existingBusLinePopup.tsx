import {Popup} from "react-leaflet";
import {Feature} from "geojson";

interface ExistingBusLinePopupProps {
    existingLine: Feature;
}

export default function ExistingBusLinePopup({existingLine}: ExistingBusLinePopupProps) {
    return <Popup>
        <h1 className={"text-lg"}>Buslinie {existingLine.properties!.ref}</h1>
        <br/>
        <span className={"font-bold"}>Start:</span> {existingLine.properties!.from}<br />
        <span className={"font-bold"}>Ende:</span> {existingLine.properties!.to}<br />
        <span className={"font-bold"}>Betreiber:</span> {existingLine.properties!.operator}<br />
        <br/>
        <a className={"text-blue-500 underline"} href={`https://www.openstreetmap.org/${existingLine.properties!["@id"]}`} target={"_blank"} rel={"noreferrer"}>Auf OpenStreetMap ansehen</a>
    </Popup>;
}