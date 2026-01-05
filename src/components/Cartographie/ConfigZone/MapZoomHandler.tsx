import { useMapEvents } from "react-leaflet"; // Importer useMapEvents
import useMapStore from "stores/map/useMapStore";

const MapZoomHandler = () => {
    const setMapData = useMapStore((state) => state.set);

    useMapEvents({
        zoomend: (event) => {
            setMapData({ zoomLevel: event.target.getZoom() });
        },
        load: (event) => {
            setMapData({ zoomLevel: event.target.getZoom() });
        }
    });

    return null;
};

export default MapZoomHandler;