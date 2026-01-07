import { GET_ALL_REQUETE_CARTE_T, GET_REQUETE_CARTE_T } from "types";
import { create } from "zustand";

interface REQUETE_DATA_T {
    title?: string,
    data: GET_REQUETE_CARTE_T[],
    icon?: any
}

interface Props_T {
    set: {
        (partial: Props_T | Partial<Props_T> | ((state: Props_T) => Props_T | Partial<Props_T>), replace?: false): void;
        (state: Props_T | ((state: Props_T) => Props_T), replace: true): void;
    }
    allRequeteCartoSelected: { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[],
    requetesData: REQUETE_DATA_T[],
    toogleElementInSelectedListe: (element: {
        icon?: any;
        data: GET_ALL_REQUETE_CARTE_T;
    }) => void,
    data: {
        icon?: any;
        data: GET_ALL_REQUETE_CARTE_T;
    }[]
}

export default create<Props_T>((set, get) => ({
    set: set,
    allRequeteCartoSelected: [],
    requetesData: [],
    toogleElementInSelectedListe: (element: { icon?: any, data: GET_ALL_REQUETE_CARTE_T }) => {
        const { allRequeteCartoSelected } = get();
        let isInListe = allRequeteCartoSelected.find(({ data }) => data.Nom_View === element.data.Nom_View);

        if (!!isInListe) {
            let res: { icon?: any, data: GET_ALL_REQUETE_CARTE_T }[] = allRequeteCartoSelected.filter(({ data }, index) => data.Nom_View != element.data.Nom_View);

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