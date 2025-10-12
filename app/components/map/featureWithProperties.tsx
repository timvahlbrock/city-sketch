import {Feature} from "geojson";

export type FeatureWithProperties = Feature & { properties: { [key: string]: any } };

export function isFeatureWithProperties(feature: Feature): feature is FeatureWithProperties {
    return feature.properties !== undefined && feature.properties !== null;
}
