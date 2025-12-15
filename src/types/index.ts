export type USE_STATE_T<T = any> = React.Dispatch<React.SetStateAction<T>>

export type TYPE_LOCALITE_T = "Departement" | "Region"

export interface GET_ALL_REQUETE_CARTE_T {
    Code_Rapport: number,
    Date_Insertion: string,
    Id_Projet: number,
    Nom_View: string,
    codeSQL: string,
    fiche_carto: null | any,
    intitule: string,
    requete_conf: number
}

export interface GET_REQUETE_CARTE_T {
    LG?: number,
    LT?: number,
    [any: string]: any,
}

export interface GET_VALUE_PER_LOCALITE_T {
    t_requete_carte: GET_ALL_REQUETE_CARTE_T,
    element: {
        longitude: number | undefined,
        latitude: number | undefined,
        total: number
    }[]
}

export type LOADING_STATE_T = null
    | "En cours de chargement"
    | "Chargement finit"
    | "Une erreur est survenue"
    | "Chargement reussit";

export interface GET_ALL_REGION_T {
    code_region: string,
    coord_gps: null | string,
    couleur: string | null,
    id_region: number
    latitude: number,
    longitude: number,
    nom_region: string,
    shapefile: null | string,
    nomdepartement: null | string
}



export interface RESPONSE_T {
    code: 200 | 400 | 403 | 404 | 500 | 505,
    data: any[],
    message: string,
}

export interface GET_ALL_FICHE_T {
    nom: string,
    id: number,
    couleut: string | null
}

export interface VILLAGE_T {
    nom_village: string,
    latitude: string,
    longitude: string,
    jeune: number,
    femme: number,
    homme: number,
}

export interface COMMUNE_T {
    nom_commune: string,
    code_commune: string,
    villages: VILLAGE_T[]
}

export interface PROVINCE_T {
    nom_departement: string,
    code_departement: string,
    communes: Omit<COMMUNE_T, 'villages'>[],
    villages: VILLAGE_T[]
}

export interface REGION_T {
    code_region: string,
    nom_region: string,
    departements: PROVINCE_T[],
    communes: Omit<COMMUNE_T, 'villages'>[],
    villages: VILLAGE_T[],
    couleur: string

}

export interface COUCHE_DE_DONNEE_T {
    nom_zone: string,
    couleur: string,
    couleur_c: string,
    shapefile: string,
    description?: string,
    superficie: string,
    [key: string]: any;
}

export interface SHAPE_OBJECT_T {
    name: string,
    filePath: any,
    imageUrl?: any,
    couleur?: string,
    couleur_c?: string,
    opacity?: number,
    metaData?: {
        [key: string]: string | number;
    },
}

export interface GET_ALL_FEUILLE {
    [key: string]: {
        feuille: {
            Libelle_Classeur: string;
            Code_Feuille: string;
            Table_Feuille: string;
            Libelle_Feuille: string;
        };
        lignes: {
            Libelle_Ligne: string;
            Nom_Collone: string;
        }[];
        data: {
            Id: string;
            Stat: string;
            Date_Insertion: string;
            Login: string;
            LG: string | null;
            LT: string | null;
            [key: string]: string | null; // For col0, col1, col2, etc.
        }[];
    }[]
}

export interface ICON_T {
    id: number,
    file: string
}

export interface LOCALITE_REGION_T {
    code_region: string;
    nom_region: string;
    abrege_region: string;
    zone_r: string;
    couleur: string;
    coord_gps: string;
    departements: {
        id_departement: string | number;
        nom_departement: string;
        code_departement: string;
        abrege_departement: string;
        communes: {
            id_commune: string | number;
            nom_commune: string;
            code_commune: string;
            villages: {
                id_village: string | number;
                code_village: string;
                nom_village: string;
                annee: number;
                longitude: string;
                latitude: string;
                homme: number;
                femme: number;
                jeune: number;
                nb_menage: number;
            }[];
        }[];
    }[];
};

export interface RAPORT_CARTO_T {
    title: string,
    code: number
}


export interface GET_ALL_RAPORT_CARTO_T {
    count: number,
    rapports?: RAPORT_CARTO_T[]
}

export interface GET_RAPORT_CARTO_T {
    title: string,
    code: string,
    headers: string[],
    rows: { [key: string]: string }[]
}