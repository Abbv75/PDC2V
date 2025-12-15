import { useEffect, useState } from 'react';
import { Polygon, useMap } from "react-leaflet";
import L from 'leaflet';
import IvoryCoastGeoJSON from 'assets/JSON/IvoryCoastGeoJSON';

const WORLD_COORDS = [
    [90, -180],
    [90, 180],
    [-90, 180],
    [-90, -180],
    [90, -180]
];

export default () => {
    const map = useMap();
    const [maskPositions, setMaskPositions] = useState<any[] | null>(null);

    const loadMask = async () => {
        try {
            const data = IvoryCoastGeoJSON;
            let coordinates: any[] = [];

            if (data.features[0].geometry.type === "Polygon") {
                coordinates = data.features[0].geometry.coordinates[0];
            } else if (data.features[0].geometry.type === "MultiPolygon") {
                coordinates = data.features[0].geometry.coordinates[0][0];
            }

            const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]]);

            setMaskPositions([WORLD_COORDS, latLngs]);

            const bounds = L.latLngBounds(latLngs as any);
            map.fitBounds(bounds);
        } catch (error) {

        }
    }

    useEffect(() => {
        loadMask()
    }, [map])

    if (!maskPositions) return null;

    return (
        <Polygon
            positions={maskPositions}
            pathOptions={{
                color: 'transparent', // Pas de bordure
                fillColor: '#ffffffff', // Blanc pour cacher le reste
                fillOpacity: 1,       // Opacité totale
                weight: 0,
                interactive: false,    // Permet de cliquer au travers  
            }}
        />
    );
};
