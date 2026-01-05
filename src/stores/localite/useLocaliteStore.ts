import { COMMUNE_T, LOADING_STATE_T, LOCALITE_REGION_T, PROVINCE_T, REGION_T, VILLAGE_T } from "types";
import { create } from "zustand";

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    data: LOCALITE_REGION_T[];
    loadingState: LOADING_STATE_T;
    localiteRegionsSelected: REGION_T[];
    localiteDepartementsSelected: PROVINCE_T[];
    localiteCommunesSelected: COMMUNE_T[];
    localiteVillagesSelected: VILLAGE_T[];
}

export default create<Props_T>((set, get) => ({
    data: [],
    set: set,
    loadingState: null,
    localiteRegionsSelected: [],
    localiteCommunesSelected: [],
    localiteDepartementsSelected: [],
    localiteVillagesSelected: []
}));