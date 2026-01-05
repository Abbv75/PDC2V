import { COUCHE_DE_DONNEES_LISTE } from "constant";
import { create } from "zustand";

interface Props_T {
    set : {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    coucheDeDonneesSelectedListe : typeof COUCHE_DE_DONNEES_LISTE;
}

export default create<Props_T>((set, get) => ({
    set: set,
    coucheDeDonneesSelectedListe: [],
}));