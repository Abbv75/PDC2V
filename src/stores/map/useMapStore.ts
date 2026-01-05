import { COUCHE_DE_DONNEES_LISTE, FOND_DE_CARTE } from "constant";
import { create } from "zustand";

interface Props_T {
    set : {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    currentMapSelected : typeof FOND_DE_CARTE[0],
    zoomLevel: number
}

export default create<Props_T>((set, get) => ({
    set: set,
    currentMapSelected: FOND_DE_CARTE[0],
    zoomLevel: 7
}));