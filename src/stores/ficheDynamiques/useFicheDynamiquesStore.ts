import { GET_ALL_FEUILLE, GET_REQUETE_CARTE_T, LOADING_STATE_T } from "types";
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
    getAllFicheData: GET_ALL_FEUILLE | null,
    ficheDynamiquesData: { title: string, icon: any }[],
    ficheTitleSelected: string[],
    ficheTitle: string[],
    elementListe: REQUETE_DATA_T[],
    loadingState: LOADING_STATE_T,
    toogleElementInFicheTitleSelected: (element: string) => void
}

export default create<Props_T>((set, get) => ({
    set: set,
    getAllFicheData: null,
    ficheDynamiquesData: [],
    ficheTitleSelected: [],
    elementListe: [],
    ficheTitle: [],
    loadingState: null,
    toogleElementInFicheTitleSelected: (element: string) => {
        const isInList = get().ficheTitleSelected.includes(element);

        if (isInList) {
            set({ ficheTitleSelected: get().ficheTitleSelected.filter(v => v !== element) });
        } else {
            set({ ficheTitleSelected: [...get().ficheTitleSelected, element] });
        }
    },
}));