import L from "leaflet";
import { COUCHE_DE_DONNEE_T } from "types";
import { CoucheDonneePopupContent } from "../CoucheDonneePopupContent";
import useReglageStore from "stores/reglage/useReglageStore";

export default (
    layer: L.Layer,
    metaData: COUCHE_DE_DONNEE_T["metaData"]
) => {
    if (!metaData) return null;

    const { keyToHides } = useReglageStore.getState();

    const popUpContent = Object.entries(metaData)
        .filter(([key]) => !keyToHides.includes(key))
        .map(([key, value]) =>
            CoucheDonneePopupContent(key, String(value))
        )
        .join("");

    if (!popUpContent) return null;

    layer.bindPopup(popUpContent);

    return null;
};
