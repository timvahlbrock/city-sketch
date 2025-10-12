import {Feature, FeatureCollection} from "geojson";
import {ExistingBusLine} from "@/app/components/map/existingBusNetwork/existingBusLine";
import ExistingBusStop from "@/app/components/map/existingBusNetwork/existingBusStop";

interface Props {
    network: FeatureCollection;
}

export default function ExistingBusNetwork({ network }: Props) {
    const busLines = (network?.features ?? [])
        .filter(feature => feature.properties)
        .filter(feature => feature.properties!.type == "route")
        .filter(feature => feature.properties!.route == "bus");
    const stops = (network?.features ?? [])
        .filter(feature => feature.properties)
        .filter(feature => feature.properties!.public_transport == "stop_position")
        .filter(feature => feature.properties!.bus == "yes");

    const renderedLines = busLines.map(feature => <ExistingBusLine key={feature.properties!["@id"]} existingLine={feature} />);
    const renderedStops = stops.map(feature => <ExistingBusStop key={feature.properties!["@id"]} existingStop={feature} />);

    return <>
        {renderedLines}
        {renderedStops}
    </>;
}
