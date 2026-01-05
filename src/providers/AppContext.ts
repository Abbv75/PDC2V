import { createContext } from "react";
import { COMMUNE_T, GET_ALL_FEUILLE, GET_ALL_REQUETE_CARTE_T, PROVINCE_T, RAPORT_CARTO_T, REGION_T, SHAPE_OBJECT_T, USE_STATE_T, VILLAGE_T } from "../types";
import { FOND_DE_CARTE } from "../constant";
import { coucheDeDonneesElementConfig_T } from "types/AppT";

export const AppContext = createContext({} as {
    mapRef: React.RefObject<HTMLDivElement>,
    ficheTitleSelected: string[], setficheTitleSelected: USE_STATE_T,
    getAllFicheData: null | GET_ALL_FEUILLE, setgetAllFicheData: USE_STATE_T,
    ficheDynamiquesData: { title: string, icon: any }[], setficheDynamiquesData: USE_STATE_T,
    legendeSection: {
        coucheDeDonnee?: JSX.Element,
        ficheDeDonnee?: JSX.Element,
        ficheDynamique?: JSX.Element,
        rapportCarto?: JSX.Element
    }, setlegendeSection: USE_STATE_T,
    addImageIsOpen: boolean, setaddImageIsOpen: USE_STATE_T,
    loadIconList: any,
    iconList: string[],
    showFiligram?: boolean, setshowFiligram?: USE_STATE_T,
    showShapeFileColorEditer: boolean, setshowShapeFileColorEditer: USE_STATE_T<boolean>,
    ShapeFileColorEditerSubmitFunction?: ((borderColor?: string, backgroundColor?: string, reset?: boolean) => any),
    setShapeFileColorEditerSubmitFunction: USE_STATE_T<((borderColor?: string, backgroundColor?: string, reset?: boolean) => any) | undefined>,
    ShapeFileColorEditerDefaultValues?: {
        borderColor?: string,
        backgroundColor?: string
    },
    setShapeFileColorEditerDefaultValues: USE_STATE_T<{
        borderColor?: string,
        backgroundColor?: string
    } | undefined>,
    allRapportCartoSelected: { data: RAPORT_CARTO_T, color?: string }[],
    setallRapportCartoSelected: USE_STATE_T<{ data: RAPORT_CARTO_T, color?: string }[]>,
});