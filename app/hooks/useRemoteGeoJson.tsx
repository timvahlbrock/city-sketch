import {useEffect, useState} from "react";
import {FeatureCollection} from "geojson";

export default function useRemoteGeoJson(url: string) {
    const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setGeoJson(data))
            .catch(error => console.error('Error fetching bus data:', error));
    }, []);

    return geoJson;
}