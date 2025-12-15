import { COUCHE_DE_DONNEE_T } from "types";
import { CoucheDonneePopupContent } from "../CoucheDonneePopupContent";

export default (layer: L.Layer, metaData: COUCHE_DE_DONNEE_T["metaData"]) => {
    if (!metaData) return null;

    const popUpContent = Object.entries(metaData)
        .map(([key, value]) => CoucheDonneePopupContent(key, value as string))
        .join(``);

    layer.bindPopup(popUpContent);

    return null
}