import { useMapEvents } from "react-leaflet"; // Importer useMapEvents
import { useContext } from "react"; // Importer useState
import { AppContext } from "../../../providers";

const MapZoomHandler = () => {
    const { setzoomLevel } = useContext(AppContext);

    useMapEvents({
        zoomend: (event) => {
            setzoomLevel && setzoomLevel(event.target.getZoom());
        },
        load: (event) => {
            setzoomLevel && setzoomLevel(event.target.getZoom());
        }
    });

    return null;
};

export default MapZoomHandler;