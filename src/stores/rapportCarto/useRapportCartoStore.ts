import { GET_RAPORT_CARTO_T, RAPORT_CARTO_T } from "types";
import { create } from "zustand";

interface Props_T {
    set : {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    allRapportCartoSelected : { data: RAPORT_CARTO_T, color?: string }[],
    requetesData : { data: GET_RAPORT_CARTO_T, color?: string }[],
}

export default create<Props_T>((set, get) => ({
    set: set,
    allRapportCartoSelected: [],
    requetesData: [],
}));