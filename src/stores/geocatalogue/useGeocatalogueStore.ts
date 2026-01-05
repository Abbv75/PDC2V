import useCoucheDeDonneeStore from "stores/coucheDeDonnee/useCoucheDeDonneeStore";
import { COUCHE_DE_DONNEE_T, LOADING_STATE_T, SHAPE_OBJECT_T } from "types";
import { create } from "zustand";

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    data: COUCHE_DE_DONNEE_T[];
    loadingState: LOADING_STATE_T;
    //Ajouter ou retirer un element de la liste des couches de donnees selectionnees
}

export default create<Props_T>((set, get) => ({
    data: [],
    set: set,
    loadingState: null,
}));