import { GET_ALL_REQUETE_CARTE_T, GET_REQUETE_CARTE_T, MARKER_TEXT_FONT_T } from "types";
import { create } from "zustand";

interface REQUETE_DATA_T {
    title?: string,
    data: GET_REQUETE_CARTE_T[],
    icon?: any,
    iconSize?: number,
    selectedFields?: string[],
    markerTextFont?: MARKER_TEXT_FONT_T
}

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    allRequeteCartoSelected: { 
        icon?: any, 
        iconSize?: number, 
        selectedFields?: string[], 
        markerTextFont?: MARKER_TEXT_FONT_T,
        data: GET_ALL_REQUETE_CARTE_T 
    }[],
    requetesData: REQUETE_DATA_T[],
    requetesDataCache: { [Nom_View: string]: GET_REQUETE_CARTE_T[] },
    toogleElementInSelectedListe: (element: {
        icon?: any;
        iconSize?: number;
        selectedFields?: string[];
        markerTextFont?: MARKER_TEXT_FONT_T;
        data: GET_ALL_REQUETE_CARTE_T;
    }) => void,
    data: {
        icon?: any;
        iconSize?: number;
        selectedFields?: string[];
        markerTextFont?: MARKER_TEXT_FONT_T;
        data: GET_ALL_REQUETE_CARTE_T;
    }[]
}

export default create<Props_T>((set, get) => ({
    set: set,
    allRequeteCartoSelected: [],
    requetesData: [],
    requetesDataCache: {},
    toogleElementInSelectedListe: (element: { icon?: any, iconSize?: number, selectedFields?: string[], markerTextFont?: MARKER_TEXT_FONT_T, data: GET_ALL_REQUETE_CARTE_T }) => {
        const { allRequeteCartoSelected } = get();
        let isInListe = allRequeteCartoSelected.find(({ data }) => data.Nom_View === element.data.Nom_View);

        if (!!isInListe) {
            let res: { icon?: any, iconSize?: number, selectedFields?: string[], markerTextFont?: MARKER_TEXT_FONT_T, data: GET_ALL_REQUETE_CARTE_T }[] = allRequeteCartoSelected.filter(({ data }, index) => data.Nom_View != element.data.Nom_View);

            set({ allRequeteCartoSelected: res });
        }
        else {
            set({
                allRequeteCartoSelected: [
                    ...allRequeteCartoSelected,
                    element
                ]
            });
        }
    },
    data :[]
}));
