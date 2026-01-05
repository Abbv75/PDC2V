import { GET_ALL_REQUETE_CARTE_T, GET_REQUETE_CARTE_T } from "types";
import { create } from "zustand";

interface REQUETE_DATA_T {
    title?: string,
    data: GET_REQUETE_CARTE_T[],
    icon?: any
}

interface Props_T {
    set : {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    allRequeteCartoSelected : { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[],
    requetesData : REQUETE_DATA_T[],
}

export default create<Props_T>((set, get) => ({
    set: set,
    allRequeteCartoSelected: [],
    requetesData: [],
}));