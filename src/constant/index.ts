export { axiosInstance } from "./axiosInstance"
export { COUCHE_DE_DONNEES_LISTE } from "./coucheDeDonnee"
export { COLOR } from "./color"
export { FOND_DE_CARTE } from "./fondDeCarte"
export { IMAGE } from "./image"
export { LOCATION } from "./location"
export { SIDE_PANEL_LIST } from "./sidePanelList"
export { CARTO_MENU_EN_TETE_ZONE } from "./cartoMenuEntete";
export { default as ICON } from './icon';

export const REACT_APP_SHAPE_FILE_URL = process.env.NODE_ENV == "production"
    ? process.env.REACT_APP_SHAPE_FILE_URL_PROD
    : process.env.REACT_APP_SHAPE_FILE_URL_DEV;