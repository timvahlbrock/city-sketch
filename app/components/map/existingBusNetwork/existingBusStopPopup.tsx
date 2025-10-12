import {Popup} from "react-leaflet";
import {FeatureWithProperties} from "@/app/components/map/featureWithProperties";

interface ExistingBusStopPopupProps {
    existingStop: FeatureWithProperties
}

export default function ExistingBusStopPopup({existingStop}: ExistingBusStopPopupProps) {
    const lines = (existingStop.properties["@relations"] ?? [])
        .filter((relation: any) => relation.role === "stop" && relation.reltags?.type === "route")
        .map((relation: any) => relation.reltags.ref + " " + relation.reltags.to)

    return  <Popup>
        <h1 className={"text-lg"}>Haltestelle "{existingStop.properties.name}"</h1>
        <br/>
        <span className={"font-bold"}>Linien:</span><br/>
        {lines.length > 0 && <ul className={"list-disc list-inside ms-2"}>
            {lines.map((line: string, index: number) => <li key={index}>{line}</li>) ?? <li>Keine Buslinien</li>}
        </ul>}
        {lines.length === 0 && <span>Keine Buslinien</span>}
        <br/>
        <br/>
        <a className={"text-blue-500 underline"} href={`https://www.openstreetmap.org/${existingStop.properties["@id"]}`} target={"_blank"} rel={"noreferrer"}>Auf OpenStreetMap ansehen</a>
    </Popup>
}