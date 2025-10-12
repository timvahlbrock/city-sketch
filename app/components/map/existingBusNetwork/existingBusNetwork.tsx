import {Feature, FeatureCollection} from "geojson";
import {ExistingBusLine} from "@/app/components/map/existingBusNetwork/existingBusLine";

interface Props {
    network: FeatureCollection;
}

export default function ExistingBusNetwork({ network }: Props) {
    const filteredFeatures = (network?.features ?? [])
        .filter(feature => feature.properties)
        .filter(feature => feature.properties!.type == "route")
        .filter(feature => feature.properties!.route == "bus");

    return filteredFeatures
        .map(feature => <ExistingBusLine key={feature.properties!.id} existingLine={feature} />);
}
