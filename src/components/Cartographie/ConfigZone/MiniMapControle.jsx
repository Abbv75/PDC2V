import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-minimap';
import 'leaflet-minimap/dist/Control.MiniMap.min.css';

export const MiniMapControle = () => {
    const map = useMap();

    useEffect(() => {
        const miniMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        });

        const miniMap = new L.Control.MiniMap(miniMapLayer, {
            toggleDisplay: true,
            minimized: false,   
            position: 'bottomright', 
            width: 120,
            height: 80,
        }).addTo(map);

        return () => {
            miniMap.remove();
        };
    }, [map]);

    return null;
};